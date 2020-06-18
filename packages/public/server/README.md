<img src="https://assets.serlo.org/meta/logo.png" alt="Serlo logo" title="Serlo" align="right" height="60" />

# Serlo.org Server

## Guides

### Creating a new module

To create a new module, do the following:

1. Add a new directory for the module in `src/module` with the following structure:
   ```
   src/module/Foo
   ├── config/
   │   ├── module.config.php
   ├── src/ (represents namespace `Foo`)
   │   ├── Module.php
   ├── test/ (optionally, represents namespace `FooTest` containing tests)
   ```
2. Add a minimal module config in `src/module/Foo/config/module.config.php`:

   ```php
   <?php

   namespace Foo;

   return [];
   ```

3. Add a minimal module in `src/module/Foo/Module.php`:

   ```php
   <?php

   namespace Foo;

   use Zend\ModuleManager\Feature\ConfigProviderInterface;

   class Module implements ConfigProviderInterface
   {
     public function getConfig()
     {
       return include __DIR__ . '/../config/module.config.php';
     }
   }
   ```

4. Register the namespace by adding it to the key `autoload.psr-4` in [composer.json](./composer.json):
   ```json
   {
     "autoload": {
       "psr-4": {
         "Foo\\": "src/module/Foo/src"
       }
     }
   }
   ```
5. If you added tests, register the test namespace by adding it to the key `autoload-dev.psr-4` in [composer.json](./composer.json):
   ```json
   {
     "autoload-dev": {
       "psr-4": {
         "FooTest\\": "src/module/Foo/test"
       }
     }
   }
   ```
6. Register the module by adding it to the key `modules` in [src/config/application.config.php](./src/config/application.config.php):

   ```php
   <?php

   return [
     'modules' => ['Foo'],
   ];
   ```

## Best Practices

Covers some best practices that new code should comply to.

### Dependency Injection

- You MUST NOT use `zend-di`. Instead, use the service manager and define factories if needed.
- You MUST NOT use `*AwareTrait`s. Instead, define an instance variable and set that in the constructor.
- When injecting services, you MUST refer to them via `::class`.
- When injecting services, you SHOULD prefer interfaces to concrete classes.
- When registering services intended to be used by other modules, you SHOULD define an interface and register the service via `ServiceInterface::class`

### Permissions

- You MUST register permissions in `Authorization\Permission` and refer to them via `Permission::` to ensure they are globally unique.

### Routing

- You MUST namespace routes with the name of the module they are defined in to ensure that they are globally unique.

### Visibility

- You SHOULD NOT use `private`. Use `protected` instead so that one can override stuff in tests.
- You SHOULD use `protected` for everything that does not need to be `public`.

## Configuration

- **Autoreview:**
  There is a possibility to define taxonomy terms in which each edit shall be automatically reviewed.
  This is useful when you want for example set up a sandbox area in which all edits shall be automatically online.
  To archieve this you need to set the configuration variable `autoreview_taxonomy_term_ids` to the list of those taxonomy term ids.
