iredmail-alias-api
==================

This is a quick and dirty API for altering the "aliases" and "forwardings"
tables in the PostgreSQL installation of iRedMail. It's written in a combination
of ES5 and ES6, with a target of running on Node.js without babel or another
source code translator.

This can probably be easily extended to the MySQL installation of iRedMail, but
I haven't tested that.

This can probably be drastically improved, and I'm okay with that.

## Running the API

### Configuration

Copy config.example.js to config.js, and alter to your needs.

* http
  * port - Port to run the server on
  * compression - Use gzip compression in the http server, not required if proxied behind another web server or load balancer that provides gzip for you
* db
  * dialect - Sequelize database dialect, can be 'postgres' or 'mysql' for an iRedMail installation, but has only been tested with postgres
  * host - Hostname or IP address of the database server
  * database - Database name, which is 99% likely to be *vmail*
  * user - Username to log in to the database server
  * password - Password to log in to the database server

### Execute

In a development environment, for auto reload:

```
npm install
npm run dev
```

In production:

```
npm install --production
NODE_ENV=production npm run start
```

## API

### Up Check

#### GET /up

Returns OK, with a status of 200, as a simple up checker.

#### GET /up/full

Returns a JSON object with the status of the database connection. Returns 200 if
no errors, 500 if any errors are detected.

```
{
    "status": "OK",
    "database": "OK",
    "errors": []
}
```

### Aliases

#### GET /api/v1/aliases

Retrieve a list of domains in the aliases table.

```
[
    {
        "domain": "foo.com"
    }
]
```

#### GET /api/v1/aliases/[domain_name]

Retrieve a list of addresses attached to a given domain name.

```
[
    {
        "address": "bar@foo.com"
    }
]
```

#### GET /api/v1/aliases/[domain_name]/[username]

Retrieve an alias record for [username]@[domain_name]. Returns 404 if it does
not exist.

```
{
    "address": "bar@foo.com",
    "name": "",
    "accesspolicy": "",
    "domain": "foo.com",
    "created": "2018-01-01T01:23:45.000Z",
    "modified": "2018-01-01T01:23:45.000Z",
    "expired": "9999-12-31T06:00:00.000Z",
    "active": 1
}
```

#### POST /api/v1/aliases/[domain_name]/[username]

Create an alias record for [username]@[domain_name]. Returns 409 if an object
already exists, 201 if an object was created.

Request - all optional

```
{
    "accesspolicy": "",
    "active": true
}
```
```
{
    "status": "OK"
}
```

#### PUT /api/v1/aliases/[domain_name]/[username]

Update or create an alias record for [username]@[domain_name]. Returns 201 if an object was created, 200 if an object was updated.

Request - all optional

```
{
    "accesspolicy": "",
    "active": true
}
```
```
{
    "status": "OK"
}
```

#### DELETE /api/v1/aliases/[domain_name]/[username]

Delete an alias record for [username]@[domain_name]. Returns 404 if an object
doesn't exist, 200 if the object was deleted.

### Forwardings

#### GET /api/v1/forwardings

Retrieve a list of domains in the forwardings table.

```
[
    {
        "domain": "foo.com"
    }
]
```

#### GET /api/v1/forwardings/[domain_name]

Retrieve a list of addresses attached to a given domain name.

```
[
    {
        "address": "bar@foo.com"
    }
]
```

#### GET /api/v1/forwardings/[domain_name]/[username]

Retrieve a forwarding record for [username]@[domain_name]. Returns 404 if it
does not exist.

```
{
    "id": 2,
    "address": "bar@foo.com",
    "forwarding": "foobar192019831@gmail.com",
    "domain": "foo.com",
    "dest_domain": "gmail.com",
    "is_list": 0,
    "is_forwarding": 1,
    "is_alias": 0,
    "active": 1
}
```

#### POST /api/v1/forwardings/[domain_name]/[username]

Create a forwarding record for [username]@[domain_name]. Returns 409 if an
object already exists.

Request - all optional

```
{
    "forwarding": "user1092301239@gmail.com"
}
```
```
{
    "status": "OK"
}
```

#### PUT /api/v1/forwardings/[domain_name]/[username]

Update or create a forwarding record for [username]@[domain_name]. Returns 201 if an object was created, 200 if an object was updated.

Request

```
{
    "forwarding": "user1092301239@gmail.com"
}
```
```
{
    "status": "OK"
}
```

#### DELETE /api/v1/forwardings/[domain_name]/[username]

Delete a forwarding record for [username]@[domain_name]. Returns 404 if an
object doesn't exist, 200 if the object was deleted.
