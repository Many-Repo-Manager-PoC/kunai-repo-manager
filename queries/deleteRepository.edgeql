with DeletedRepository := (
    delete Repository 
    filter .repository_id = <int64>$repository_id or .name = <str>$name
)
select DeletedRepository {**};
