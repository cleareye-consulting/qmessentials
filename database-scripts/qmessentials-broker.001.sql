create table subscriptions (
	subscription_id serial primary key,
	lot_id varchar not null,
	created_date timestamp with time zone not null,
	created_by varchar not null,
	callback_url varchar not null
);

create table engines (
	engine_id int not null primary key,
	engine_url varchar not null,
	created_date timestamp with time zone not null
);

create table lots (
	lot_id varchar not null primary key,
	engine_id int not null references engines (engine_id),
	created_date timestamp with time zone not null
);

create table lot_metric_calculations (
	lot_id varchar not null,
	metric_id varchar not null,
	product_id varchar not null,
	count int null,
	min_value decimal null,
	max_value decimal null,
	average decimal null,
	sum decimal null,
	first_quartile decimal null,
	median decimal null,
	third_quartile decimal null,
	standard_deviation decimal null,
	created_date timestamp with time zone not null,
	constraint pk_lot_metric_calculations primary key (lot_id, metric_id)
);
