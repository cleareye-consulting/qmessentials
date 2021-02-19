package main

import (
	"encoding/json"
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
	id, err := repo.AddUser(&user)
	if err != nil {
		log.Error().Err(err).Msg("")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
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
	//verify JWT
	//if verified, retrieve and return user
	//if not verified, return 401
}

func handlePostPasswordChange(w http.ResponseWriter, r *http.Request) {

}
