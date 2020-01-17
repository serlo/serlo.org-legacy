<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

$env = 'development';

$assets = [
    'assets_host' => 'http://localhost:8082/',
    'bundle_host' => 'http://localhost:8081/',
];

$services = [
    'editor_renderer' => 'http://editor-renderer:3000',
    'frontend' => 'http://frontend:3000',
    'legacy_editor_renderer' => 'http://legacy-editor-renderer:3000',
    'hydra' => 'http://hydra:4445',
];

$db = [
    'host' => 'mysql',
    'port' => '3306',
    'username' => 'root',
    'password' => 'secret',
    'database' => 'serlo',
];

$recaptcha = [
    'key' => '6LfwJFwUAAAAAKHhl-kjPbA6mCPjt_CrkCbn3okr',
    'secret' => '6LfwJFwUAAAAAPVsTPLe00oAb9oUTewOUe31pXSv',
];

$smtp_options = [];
$tracking = [];
$featureFlags = [
    'client-frontend' => false,
    'donation-banner' => true,
    'frontend-content' => false,
    'frontend-diff' => false,
    'frontend-donation-banner' => false,
    'frontend-editor' => false,
    'frontend-footer' => false,
    'frontend-legacy-content' => false,
    'key-value-store' => false,
];

$keyValueStore = [
    'hosts' => ['redis'],
];

$cronjob_secret = 'secret';
$upload_secret = 'secret';
$mock_email = true;
