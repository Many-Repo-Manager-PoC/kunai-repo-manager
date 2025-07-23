CREATE MIGRATION m15a5zn55pwuuczsfzqw23f5jfqq7323dg6kagmgupurmbxwtq3qpq
    ONTO m17gt525r25kgqwvsfrplorpfr4utsbnmynwfdhvqm7fpzpxv7zaiq
{
  ALTER TYPE default::Repository {
      CREATE CONSTRAINT std::exclusive ON (.repository_id);
  };
};
