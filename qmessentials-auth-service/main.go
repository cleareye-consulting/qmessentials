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
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
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
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	log.Debug().Msg("Started")

	r := chi.NewRouter()
	r.Get("/users/{id}", handleGetUser)
	r.Get("/users/", handleGetUsers)
	r.Post("/users/", handlePostUser)
	r.Put("/users/{id}", handlePutUser)
	r.Delete("/users/{id}", handleDeleteUser)

	r.Post("/logins/", handlePostLogin)

	r.Post("/tokens", handlePostToken)

	r.Post("/password-changes/", handlePostPasswordChange)

	http.ListenAndServe(":5000", r)

}

func handleGetUser(w http.ResponseWriter, r *http.Request) {
	//TODO: require a JWT with a Role claim of "Administrator" before proceeding
	id := chi.URLParam(r, "id")
	repo := repositories.UserRepository{}
	user, err := repo.GetUserByID(id)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	userJSON, err := json.Marshal(user)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(userJSON)
}

func handleGetUsers(w http.ResponseWriter, r *http.Request) {
	//TODO: require a JWT with a Role claim of "Administrator" before proceeding
	nameParam := chi.URLParam(r, "name")
	emailParam := chi.URLParam(r, "email")
	isActiveParam := chi.URLParam(r, "isActive")
	var name *string
	var email *string
	var isActive *bool
	if nameParam != "" {
		name = &nameParam
	} else {
		name = nil
	}
	if emailParam == "" {
		email = &emailParam
	} else {
		email = nil
	}
	if strings.EqualFold(isActiveParam, "true") {
		*isActive = true
	} else if strings.EqualFold(isActiveParam, "false") {
		*isActive = false
	} else {
		isActive = nil
	}
	repo := repositories.UserRepository{}
	users, err := repo.GetUserBySearch(name, email, isActive)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	usersJSON, err := json.Marshal(users)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(usersJSON)
}

func handlePostUser(w http.ResponseWriter, r *http.Request) {
	//TODO: require a JWT with a Role claim of "Administrator" before proceeding
	repo := repositories.UserRepository{}
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var user models.User
	json.Unmarshal(bodyBytes, &user)
	if user.HashedPassword != "" {
		log.Warn().Msgf("POST received for userID %s with hashed password already set", user.ID)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var bcryptUtil utilities.BcryptUtil
	randomPassword := bcryptUtil.GenerateRandomPassword()
	encryptedPassword, err := bcryptUtil.Encrypt(randomPassword)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user.HashedPassword = string(encryptedPassword)
	user.IsPasswordChangeRequired = true
	id, err := repo.AddUser(&user)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var emailUtil utilities.EmailUtil
	welcomeMessage := fmt.Sprintf("Your QMEssentials account has been created. The user ID is %s. The initial password is %s. This password will need to be changed on the first login.", user.ID, randomPassword)
	emailUtil.SendEmail(user.EmailAddress, "New QMEssentials Account Info", welcomeMessage)
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(id))
}

func handlePutUser(w http.ResponseWriter, r *http.Request) {
	//TODO: require a JWT with a Role claim of "Administrator" before proceeding
	id := chi.URLParam(r, "id")
	repo := repositories.UserRepository{}
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var user models.User
	json.Unmarshal(bodyBytes, &user)
	if !strings.EqualFold(id, user.ID) {
		log.Error().Msg("IDs do not match")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err = repo.UpdateUser(id, &user)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func handleDeleteUser(w http.ResponseWriter, r *http.Request) {
	//TODO: require a JWT with a Role claim of "Administrator" before proceeding
	id := chi.URLParam(r, "id")
	repo := repositories.UserRepository{}
	user, err := repo.GetUserByID(id)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user.IsActive = false
	err = repo.UpdateUser(id, user)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func handlePostLogin(w http.ResponseWriter, r *http.Request) {
	repo := repositories.UserRepository{}
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var login models.Login
	err = json.Unmarshal(bodyBytes, &login)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	user, err := repo.GetUserByID(login.UserID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	var bcryptUtil utilities.BcryptUtil
	match, err := bcryptUtil.Compare(login.Password, user.HashedPassword)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !match {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	var jwtUtil utilities.JWTUtil
	token, err := jwtUtil.CreateToken(user.ID)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(token))
}

func handlePostToken(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var jwtUtil utilities.JWTUtil
	userID, err := jwtUtil.VerifyToken(string(bodyBytes))
	if err != nil {
		log.Error().Err(err).Msg("")
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
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	usersJSON, err := json.Marshal(user)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(usersJSON)
}

func handlePostPasswordChange(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	type passwordChangeRequest struct {
		userID      string
		oldPassword string
		newPassword string
	}
	var request passwordChangeRequest
	err = json.Unmarshal(bodyBytes, &request)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	repo := repositories.UserRepository{}
	user, err := repo.GetUserByID(request.userID)
	var bcryptUtil utilities.BcryptUtil
	match, err := bcryptUtil.Compare(request.oldPassword, user.HashedPassword)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if !match {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	hashedNewPassword, err := bcryptUtil.Encrypt(request.newPassword)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	user.HashedPassword = string(hashedNewPassword)
	repo.UpdateUser(request.userID, user)
	var emailUtil utilities.EmailUtil
	emailUtil.SendEmail(user.EmailAddress, "Password changed", "Your QMEssentials password has been changed. If you did not request this change, please contact your system administrator.")
	w.WriteHeader(http.StatusOK)
}
