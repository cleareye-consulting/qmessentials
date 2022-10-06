package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/cleareyeconsulting/qmessentials/auth/models"
	"github.com/cleareyeconsulting/qmessentials/auth/repositories"
	"github.com/cleareyeconsulting/qmessentials/auth/utilities"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/rs/zerolog/pkgerrors"
)

func init() {
	godotenv.Load()
}

func main() {
	//Need methods to get auth token from credentials and to get user info for auth token
	//Also need to be able to: add user and update password. Add should set "change on login" flag, which should also be available on update.
	//And need to be able to modify user claims and terminate user

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	log.Info().Msg("Started")

	err := bootstrapAdminUser()
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		panic(err)
	}

	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Post("/logins", handlePostLogin)

	r.Post("/tokens", handlePostToken)

	r.Post("/password-changes", handlePostPasswordChange)

	r.Group(func(r chi.Router) {
		r.Use(requireAdmin)
		r.Get("/users/{id}", handleGetUser)
		r.Get("/users", handleGetUsers)
		r.Post("/users", handlePostUser)
		r.Put("/users/{id}", handlePutUser)
		r.Delete("/users/{id}", handleDeleteUser)
		r.Post("/password-resets", handlePasswordReset)
	})

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "5000"
	}

	http.ListenAndServe(":"+port, r)

}

func handleGetUser(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	repo := repositories.UserRepository{}
	user, err := repo.GetUserByID(id)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	userJSON, err := json.Marshal(user)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(userJSON)
}

func handleGetUsers(w http.ResponseWriter, r *http.Request) {
	repo := repositories.UserRepository{}
	users, err := repo.ListUsers()
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	usersJSON, err := json.Marshal(users)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(usersJSON)
}

func handlePostUser(w http.ResponseWriter, r *http.Request) {
	repo := repositories.UserRepository{}
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var user models.User
	err = json.Unmarshal(bodyBytes, &user)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if user.HashedPassword != "" {
		log.Warn().Msgf("POST received for userID %s with hashed password already set", user.UserID)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var bcryptUtil utilities.BcryptUtil
	randomPassword := bcryptUtil.GenerateRandomPassword()
	encryptedPassword, err := bcryptUtil.Encrypt(randomPassword)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user.HashedPassword = string(encryptedPassword)
	user.IsPasswordChangeRequired = true
	err = repo.AddUser(&user)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var emailUtil utilities.EmailUtil
	welcomeMessage := fmt.Sprintf("Your QMEssentials account has been created. The initial password is %s. This password will need to be changed on the first login.", randomPassword)
	emailUtil.SendEmail(user.EmailAddress, "New QMEssentials Account Info", welcomeMessage)
	w.WriteHeader(http.StatusCreated)
}

func handlePutUser(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	repo := repositories.UserRepository{}
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var user models.User
	json.Unmarshal(bodyBytes, &user)
	if !strings.EqualFold(id, user.UserID) {
		log.Error().Msg("IDs do not match")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err = repo.UpdateUser(id, &user)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func handleDeleteUser(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	repo := repositories.UserRepository{}
	user, err := repo.GetUserByID(id)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user.IsActive = false
	err = repo.UpdateUser(id, user)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func handlePostLogin(w http.ResponseWriter, r *http.Request) {
	repo := repositories.UserRepository{}
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var login models.Login
	err = json.Unmarshal(bodyBytes, &login)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	user, err := repo.GetUserByID(login.UserID)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if user == nil {
		log.Warn().Msgf("Login attempt for invalid user ID %s", login.UserID)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	bcryptUtil := utilities.BcryptUtil{}
	match, err := bcryptUtil.Compare(login.Password, user.HashedPassword)
	if err != nil {
		if err.Error() == "Invalid user ID or password" {
			log.Warn().Msgf("Failed login for user %s", login.UserID)
			w.WriteHeader(http.StatusUnauthorized)
		} else {
			log.Error().Stack().Err(err).Msg("")
			w.WriteHeader(http.StatusInternalServerError)
		}
		return
	}
	if !match {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	var jwtUtil utilities.JWTUtil
	token, err := jwtUtil.CreateToken(user.UserID)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(token))
}

func handlePostToken(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var jwtUtil utilities.JWTUtil
	userID, err := jwtUtil.VerifyToken(string(bodyBytes))
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if userID == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	repo := repositories.UserRepository{}
	user, err := repo.GetUserByID(userID)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	usersJSON, err := json.Marshal(user)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(usersJSON)
}

func handlePostPasswordChange(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var request models.PasswordChange
	err = json.Unmarshal(bodyBytes, &request)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Debug().Str("oldPassword", request.OldPassword).Msg("")
	repo := repositories.UserRepository{}
	user, err := repo.GetUserByID(request.UserID)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var bcryptUtil utilities.BcryptUtil
	match, err := bcryptUtil.Compare(request.OldPassword, user.HashedPassword)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !match {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	hashedNewPassword, err := bcryptUtil.Encrypt(request.NewPassword)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user.HashedPassword = string(hashedNewPassword)
	repo.UpdateUser(request.UserID, user)
	var emailUtil utilities.EmailUtil
	emailUtil.SendEmail(user.EmailAddress, "Password changed", "Your QMEssentials password has been changed. If you did not request this change, please contact your system administrator.")
	w.WriteHeader(http.StatusOK)
}

func handlePasswordReset(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	userID := string(bodyBytes)
	repo := repositories.UserRepository{}
	user, err := repo.GetUserByID(userID)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	bcryptUtil := utilities.BcryptUtil{}
	newPassword := bcryptUtil.GenerateRandomPassword()
	hashedNewPassword, err := bcryptUtil.Encrypt(newPassword)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user.HashedPassword = string(hashedNewPassword)
	user.IsPasswordChangeRequired = true
	err = repo.UpdateUser(userID, user)
	if err != nil {
		log.Error().Stack().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func bootstrapAdminUser() error {
	repo := repositories.UserRepository{}
	isNeeded, err := repo.IsDefaultAdminNeeded()
	if err != nil {
		return err
	}
	if !isNeeded {
		return nil
	}
	log.Warn().Msg("No administrator found. Bootstrapping default admin user.")
	bcrypt := utilities.BcryptUtil{}
	err = repo.CreateDefaultAdmin(bcrypt.Encrypt)
	return err
}

func requireAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		roles, err := getRoles(authHeader)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if roles == nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		for _, role := range *roles {
			if role == "Administrator" {
				next.ServeHTTP(w, r)
				return
			}
		}
		w.WriteHeader(http.StatusUnauthorized)
	})
}

func getRoles(authHeader string) (*[]string, error) {
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, nil
	}
	token := strings.TrimPrefix(authHeader, "Bearer ")
	jwtUtil := utilities.JWTUtil{}
	userID, err := jwtUtil.VerifyToken(token)
	if err != nil {
		return nil, err
	}
	repo := repositories.UserRepository{}
	user, err := repo.GetUserByID(userID)
	if err != nil {
		return nil, err
	}
	return &user.Roles, nil
}
