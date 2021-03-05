create table metrics (
	metric_id serial primary key,
	metric_name varchar not null,
	documentation_references varchar[] null,	
	is_active boolean not null,	
	created_date timestamp with time zone not null
);

create table products (
	product_id varchar not null primary key,
	product_name varchar not null,
	documentation_references varchar[] null,
	product_status varchar not null,
	created_date timestamp with time zone not null
);

create table product_metrics (
	metric_id int not null references metrics (metric_id);,
	modifiers varchar[] null,
	product_id varchar not null references products (product_id);,
	sequence_number int not null,
	min_count int null,
	max_count int null,
	min_value numeric null,
	max_value numeric null,
	is_active boolean not null
);

create table lots (
	lot_id varchar not null primary key,
	product_id varchar not null references products (product_id);,
	lot_status varchar null,
	created_date timestamp with time zone
);

create table items (
	item_id varchar not null primary key,
	lot_id varchar not null references lots (lot_id);,
	item_status varchar null,
	created_date timestamp with time zone not null
);
