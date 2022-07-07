mongo --eval "db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD'); db = db.getSiblingDB('$DB_NAME'); db.createUser({ user: '$DB_USER', pwd: '$DB_PASSWORD', roles: [{ role: 'readWrite', db: '$DB_NAME' }] }); db = db.getSiblingDB('$TEST_DB_NAME'); db.createUser({ user: '$TEST_DB_USER', pwd: '$TEST_DB_PASSWORD', roles: [{ role: 'readWrite', db: '$TEST_DB_NAME' }] });"