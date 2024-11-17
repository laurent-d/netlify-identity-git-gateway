# *Quick start*

Follow this guide to setup your development environment.

Launch the project - Back-end part

```
bundle exec rails s
```

Launch the project - Front-end part (on other terminal tab)

```
yarn start
```

You can fill your development database with some data (let it run a few seconds then CTRL+C, you won't need hundreds of fake events to get started)

```
bundle exec rake db:seed
```

Now you can go and login with user created in the seed. View it.

```
open http://localhost:3000
```

You can check out routes with the following

```
open http://localhost:3000/rails/info/routes
```

You can access to resque dashboard, when logged in with an adminaccount, with

```
open http://localhost:3000/resque
```

Add workers to manage resque jobs like imports

```
QUEUE=* bundle exec rake environment resque:work
```

You can launch tests and get specs code coverage with the following.

```
bundle exec rake test && bundle exec rspec && open coverage/index.html
```

# Rake Tasks

Generate MongoDB indexes. Must be run when adding new indexes. See http://mongoid.org/docs/indexing.html

```
rake db:mongoid:create_indexes
```

# API

API documentations is available here: /swagger for logged in users.

### Development

To generate rswag spec template for a new controller use:

```
bundle exec rails generate rspec:swagger Api::V1::ExampleController
```

When a rswag spec change, we need to generate a new `swagger.yaml` file with:

```
bundle exec rails swagger
```

To run swagger for selected file you can use `focus: true` as usual (this will override the whole swagger.yaml file, useful during developing new endpoints). You can also use:

```
bundle exec rails swagger[spec/controllers/api/v1/me_controller_rswag_spec.rb]
```