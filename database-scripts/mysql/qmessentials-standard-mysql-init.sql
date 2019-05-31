/*create database qmessentials;*/

use qmessentials;

create table metric (
	metric_id int auto_increment primary key,
	metric_name varchar (500) not null,
    has_multiple_results bit not null,
    is_active bit not null
);

create table metric_available_qualifier (
	metric_id int not null,
    qualifier varchar (500) not null,
    sort_order int not null,
    constraint pk_metric_available_qualifier primary key (metric_id, qualifier),
    constraint fk_metric_available_qualifier_metric foreign key (metric_id) references metric (metric_id)
);

create table metric_available_unit (
	metric_id int not null,
    unit varchar (100) not null,
    sort_order int not null,
    constraint pk_metric_available_unit primary key (metric_id, unit),
    constraint fk_metric_available_unit_metric foreign key (metric_id) references metric (metric_id)
);

create table metric_industry_standard (
	metric_id int not null,
    industry_standard varchar (100) not null,
    sort_order int not null,
    constraint pk_metric_industry_standard primary key (metric_id, industry_standard),
    constraint fk_metric_industry_standard_metric foreign key (metric_id) references metric (metric_id)
);

create table metric_methodology_reference (
	metric_id int not null,
    methodology_reference varchar (500) not null,
    sort_order int not null,
    constraint pk_metric_methodology_reference primary key (metric_id, methodology_reference),
    constraint fk_metric_methodology_reference_metric foreign key (metric_id) references metric (metric_id)
);

create table users (
	id int auto_increment primary key,
	name varchar (100) not null,
    username varchar (500) not null,
    password varchar (255) not null,
    remember_token varchar (100) null,
    created_at datetime not null,
    updated_at datetime null    
);

create table role (
	role_id int auto_increment primary key,
    role_name varchar (100)
);

insert role (role_name) values ('Administrator'), ('Analyst'), ('Lead Person'), ('Quality Manager'), ('Technician');

create table user_role (
	user_id int not null,
    role_id int not null,
    constraint pk_user_role primary key (user_id, role_id),
    constraint fk_user_role_user foreign key (user_id) references users (id),
    constraint fk_user_role_role foreign key (role_id) references role (role_id)
);

create table password_resets (
	id int auto_increment primary key,
    email varchar (500) not null,
    token varchar (100) null,
    created_at datetime not null
);

create table test_plan (
	test_plan_id int auto_increment primary key,
    test_plan_name varchar (500) not null,
    is_active bit not null
);

create table test_plan_metric (
	test_plan_metric_id int auto_increment primary key,
	test_plan_id int not null,
    metric_id int not null,
    sort_order int not null,
    qualifier varchar (500) null,
    unit varchar (100) null,
    usage_code varchar (10) null,
    is_nullable bit not null,
    min_value float null,
    is_min_value_inclusive bit null,
    max_value float null,
    is_max_value_inclusive bit null,
    is_active bit not null,
    constraint fk_test_plan_metric_test_plan foreign key (test_plan_id) references test_plan (test_plan_id),
    constraint fk_test_plan_metric_metric foreign key (metric_id) references metric (metric_id)
);

create unique index ix_test_plan_metric_alternate_key on test_plan_metric (test_plan_id, metric_id);

create table product (
	product_id int auto_increment primary key,
    product_name varchar (500) not null,
    is_active bit not null
);

create table product_test_plan (
	product_test_plan_id int auto_increment primary key,
	product_id int not null,
    test_plan_sequence_number int not null,
    test_plan_id int not null,
    is_required bit not null,
    constraint fk_product_test_plan_product foreign key (product_id) references product (product_id),
    constraint fk_product_test_plan_test_plan foreign key (test_plan_id) references test_plan (test_plan_id)
);

create unique index ix_product_test_plan_alternate_key on product_test_plan (product_id, test_plan_sequence_number);

create table lot (
	lot_id int auto_increment primary key,
    lot_number varchar (100) not null,
    product_id int not null,
    customer_name varchar (500) null,
    created_date datetime not null,
    constraint fk_lot_product foreign key (product_id) references product (product_id)
);

create table item (
	item_id int auto_increment primary key,
    item_number varchar (500) not null,
    lot_id int not null,
    created_date datetime not null,
    constraint fk_item_lot foreign key (lot_id) references lot (lot_id)
);

create unique index ix_item_number_alternate_key on item (lot_id, item_number);

create table test_run (
	test_run_id int auto_increment primary key,
    item_id int not null,
    test_plan_id int not null,
    created_date datetime not null,
    constraint fk_test_run_item foreign key (item_id) references item (item_id),
    constraint fk_test_run_test_plan foreign key (test_plan_id) references test_plan (test_plan_id)
);

create table observation (
	observation_id int auto_increment primary key,
    test_run_id int not null,
    test_plan_metric_id int not null,
    created_date datetime not null,
    min_value float null,
    is_min_value_inclusive bit null,
    max_value float null,
    is_max_value_inclusive bit null,
    is_nullable bit not null,
    constraint fk_observation_test_run foreign key (test_run_id) references test_run (test_run_id),
    constraint fk_observation_test_plan_metric foreign key (test_plan_metric_id) references test_plan_metric (test_plan_metric_id)    
);

create table observation_result (
	observation_result_id int auto_increment primary key,
    observation_id int not null,
    result_value float null,
    constraint observation_result_observation foreign key (observation_id) references observation (observation_id)
);

