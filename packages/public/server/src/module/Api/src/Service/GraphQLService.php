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

namespace Api\Service;

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key;
use Raven_Client;

class GraphQLService extends AbstractGraphQLService
{
    /** @var array */
    protected $options;
    /** @var Raven_Client */
    private $sentry;

    public function __construct(array $options, $sentry)
    {
        $this->options = $options;
        $this->sentry = $sentry;
    }

    public function exec(string $query, array $variables)
    {
        $options = $this->options;
        if (!isset($options['host']) || !isset($options['secret'])) {
            return null;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $options['host']);

        $token = (new Builder())
            ->issuedBy('serlo.org')
            ->permittedFor('api.serlo.org')
            ->issuedAt(time())
            ->expiresAt(time() + 60)
            ->getToken(new Sha256(), new Key($options['secret']));

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Serlo Service=' . $token,
            'Content-Type: application/json',
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt(
            $ch,
            CURLOPT_POSTFIELDS,
            json_encode([
                'query' => $query,
                'variables' => $variables,
            ])
        );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = json_decode(curl_exec($ch), true);

        if (isset($response['errors'])) {
            $this->sentry->captureMessage(
                'GraphQL Mutation failed',
                [],
                [
                    'tags' => ['api' => true],
                    'extra' => [
                        'query' => print_r($query, true),
                        'variables' => print_r($variables, true),
                        'errors' => print_r($response['errors'], true),
                    ],
                ]
            );
        }
    }
}
