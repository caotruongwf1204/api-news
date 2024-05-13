curl --location 'http://localhost:3000/posts/get-posts' \
--header 'Content-Type: application/json' \
--data '{
    "pageSize": 10,
    "pageNumber": 1,
    "isAll": false,
    "content":"Audeo"
  }'