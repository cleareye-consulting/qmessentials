create table observations (
	observation_id uuid primary key,
	metric_id int not null,
	item_id varchar not null,
	lot_id varchar not null,
	product_id varchar not null,
	lot_sequence_number int not null,
	item_sequence_number int not null,
	modifiers varchar[] null,
	values decimal[] null,
	created_date timestamp with time zone
);
