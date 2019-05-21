create database qmessentials;

use qmessentials;

create table metric (
	metric_name varchar (500) primary key,
    has_multiple_results bit not null
);

create table metric_available_qualifier (
	metric_name varchar (500) not null,
    qualifier varchar (500) not null,
    constraint pk_metric_available_qualifier primary key (metric_name, qualifier),
    constraint fk_metric_available_qualifier_metric foreign key (metric_name) references metric (metric_name)
);

create table metric_available_unit (
	metric_name varchar (500) not null,
    unit varchar (100) not null,
    constraint pk_metric_available_unit primary key (metric_name, unit),
    constraint fk_metric_available_unit_metric foreign key (metric_name) references metric (metric_name)
);

create table metric_industry_standard (
	metric_name varchar (500) not null,
    industry_standard varchar (100) not null,
    constraint pk_metric_industry_standard primary key (metric_name, industry_standard),
    constraint fk_metric_industry_standard_metric foreign key (metric_name) references metric (metric_name)
);

create table metric_methodology_reference (
	metric_name varchar (500) not null,
    methodology_reference varchar (500) not null,
    constraint pk_metric_methodology_reference primary key (metric_name, methodology_reference),
    constraint fk_metric_methodology_reference_metric foreign key (metric_name) references metric (metric_name)
);