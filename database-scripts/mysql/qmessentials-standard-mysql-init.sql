/*create database qmessentials;*/

use qmessentials;

create table metric (
	metric_id int auto_increment primary key,
	metric_name varchar (500) not null,
    has_multiple_results bit not null
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
