DROP VIEW exact_birthdates_duplicates;
CREATE ALGORITHM = UNDEFINED DEFINER = `rksd` @`%` SQL SECURITY DEFINER VIEW `exact_birthdates_duplicates` AS
select
    group_concat(
        distinct `exact_birthdates`.`person_id` separator ','
    ) AS `duplicate_ids`,
    count(
        distinct `exact_birthdates`.`person_id`
    ) AS `persons`,
    `exact_birthdates`.`born_on` AS `born_on`
from `exact_birthdates`
group by
    `exact_birthdates`.`born_on`
having
    count(
        distinct `exact_birthdates`.`person_id`
    ) > 1