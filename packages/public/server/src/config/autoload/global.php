<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */

$packageJson = $json = json_decode(
    file_get_contents(__DIR__ . '/../../../package.json'),
    true
);

// Version number used for Sentry Release (Log Module)
$version = $json['version'];

require __DIR__ . '/../definitions.local.php';

return [
    'assets' => array_merge(
        [
            'assets_host' =>
                'https://packages.serlo.org/serlo-org-static-assets@2/',
            'bundle_host' => 'https://packages.serlo.org/serlo-org-client@22/',
        ],
        $assets
    ),

    'services' => $services,

    // (FeatureFlags Module)
    'feature_flags' => $featureFlags,

    // Branding, one entry per instance (Ui Module)
    'brand' => [
        'instances' => [
            'deutsch' => [
                'name' => '<div class="serlo-brand">Serlo</div>',
                'slogan' => 'Die freie Lernplattform',
                'description' =>
                    'Serlo ist eine kostenlose Plattform mit freien Lernmaterialien, die alle mitgestalten können.',
                'logo' => '<span class="serlo-logo">V</span>',
                'head_title' => 'lernen mit Serlo!',
            ],
            'english' => [
                'name' => '<div class="serlo-brand">Serlo</div>',
                'slogan' => 'The Open Learning Platform',
                'description' =>
                    'Serlo is a free service with open educational resources, which anyone can contribute to.',
                'logo' => '<span class="serlo-logo">V</span>',
                'head_title' => 'learn with Serlo!',
            ],
            'spanish' => [
                'name' => '<div class="serlo-brand">Serlo</div>',
                'slogan' => 'La Plataforma para el Aprendizaje Abierto',
                'description' =>
                    'Serlo es una plataforma abierta gratuita que ofrece recursos educativos, a los que todos pueden contribuir',
                'logo' => '<span class="serlo-logo">V</span>',
                'head_title' => 'aprende con Serlo!',
            ],
            'french' => [
                'name' => '<div class="serlo-brand">Serlo</div>',
                'slogan' => 'La plateforme d\'apprentissage libre',
                'description' =>
                    'Serlo est un service libre qui offre des ressources éducatives auxquelles chacun(e) peut contribuer.',
                'logo' => '<span class="serlo-logo">V</span>',
                'head_title' => 'apprendre avec Serlo!',
            ],
            'hindi' => [
                'name' => '<div class="serlo-brand">सेर्लो</div>',
                'slogan' => 'ओपन लर्निंग प्लेटफॉर्म',
                'description' =>
                    'सेर्लो खुले शैक्षिक संसाधनों के साथ एक नि: शुल्क सेवा है, जो कोई भी योगदान दे सकता है.',
                'logo' => '<span class="serlo-logo">V</span>',
                'head_title' => 'सेर्लो के साथ सीखो!',
            ],
            'tamil' => [
                'name' => '<div class="serlo-brand">Serlo</div>',
                'slogan' => 'அனைவருக்கும் திறந்த உரிமம் உள்ள ஓர் இணையத் தளம்',
                'description' =>
                    'Serlo அனைவருக்கும் ஒரு இலவச மற்றும் திறந்த உரிமம் உள்ள சேவை.',
                'logo' => '<span class="serlo-logo">V</span>',
                'head_title' => 'Serlo வுடன் கற்றுக்கொள்ளுங்கள்!',
            ],
        ],
    ],

    // Instance Module
    'instance' => [
        'strategy' => 'Instance\Strategy\DomainStrategy',
    ],

    // Newsletter Module
    'newsletter' => isset($newsletter_key)
        ? [
            'api_key' => $newsletter_key,
        ]
        : [],

    // Api Module
    'api_options' => $api_options,

    // Sentry (Log Module)
    'sentry_options' => array_merge(
        isset($sentry_dsn) ? ['dsn' => $sentry_dsn] : [],
        ['version' => $version]
    ),

    // ReCAPTCHA (Common Module)
    'recaptcha_options' => [
        'api_key' => $recaptcha['key'],
        'secret' => $recaptcha['secret'],
    ],

    // Database settings
    'dbParams' => [
        'host' => $db['host'],
        'port' => $db['port'],
        'username' => $db['username'],
        'password' => $db['password'],
        'database' => $db['database'],
    ],
    // SMTP settings (Mailman Module)
    'smtp_options' => $smtp_options,

    // (Mailman Module)
    'mailmock' => [
        'active' => $mock_email,
    ],

    // (Ui Module),
    'tracking' => $tracking,

    // Cronjobs
    'cronjob_secret' => $cronjob_secret,

    // (Attachment Module)
    'upload_secret' => $upload_secret,

    // List of taxonomy term ids in which each edit shall be autoreviewed
    'autoreview_taxonomy_term_ids' => $autoreview_taxonomy_term_ids,

    // Timestamp which is used for calculating the active community
    // Use `CURDATE()` for production system
    'mysql_timestamp_for_active_community' => isset(
        $mysql_timestamp_for_active_community
    )
        ? $mysql_timestamp_for_active_community
        : 'CURDATE()',

    // Whether we are in development mode
    'is_development_env' => isset($env) && $env == 'development',
];
