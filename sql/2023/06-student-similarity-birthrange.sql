DROP TABLE IF EXISTS student_similarity_birthrange;
CREATE TABLE student_similarity_birthrange
(
    id_low   bigint unsigned not null,
    id_high  bigint unsigned not null,
    property varchar(16)    not null,
    mean     double unsigned not null default 0,
    median   double unsigned not null default 0,
    min      double unsigned not null default 0,
    max      double unsigned not null default 0,
    count    int unsigned    not null default 0,
    key (id_low),
    key (id_high),
    unique key (id_low, id_high)
)