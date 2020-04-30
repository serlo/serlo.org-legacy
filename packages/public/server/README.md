<img src="https://assets.serlo.org/meta/logo.png" alt="Serlo logo" title="Serlo" align="right" height="60" />

# Serlo.org Server

## Creating a new module

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
3. Register the namespace by adding it to the key `autoload.psr-4` in [composer.json](./composer.json):
    ```json
    {
      "autoload": {
        "psr-4": {
          "Foo\\": "src/module/Foo/src"
        }
      }
    }
    ```
4. If you added tests, register the test namespace by adding it to the key `autoload-dev.psr-4` in [composer.json](./composer.json):
     ```json
     {
       "autoload-dev": {
         "psr-4": {
           "FooTest\\": "src/module/Foo/test"
         }
       }
     }
     ```
5. Register the module by adding it to the key `modules` in [src/config/application.config.php](./src/config/application.config.php):
    ```php
   <?php
   
   return [
       'modules' => [
           'Foo',
       ]
   ];
   ```
