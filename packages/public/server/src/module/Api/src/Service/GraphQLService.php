<?php

namespace Api\Service;

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key;
use Raven_Client;

class GraphQLService
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
