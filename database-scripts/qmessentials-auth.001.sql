create table users (
	user_id varchar not null primary key,
	given_names varchar[] not null,
	family_names varchar[] not null,
	email_address varchar null,
	is_active bool not null,
	is_password_change_required bool not null,
	hashed_password varchar,
	created_date timestamp with time zone
);

create table user_claims (
	user_id varchar not null references users (user_id),
	claim_type varchar not null,
	claim_values varchar[] null,
	create_date timestamp with time zone,
	constraint pk_user_claims primary key (user_id, claim_type)
);
