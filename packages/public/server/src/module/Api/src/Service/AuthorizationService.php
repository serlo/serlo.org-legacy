<?php

namespace Api\Service;

use Api\Exception\AuthorizationException;
use Exception;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\ValidationData;

class AuthorizationService
{
    private $options;

    public function __construct(array $options)
    {
        $this->options = $options;
    }

    /**
     * @return void
     * @throws AuthorizationException
     */
    public function assertAuthorization()
    {
        $options = $this->options;
        if (!isset($options['secret'])) {
            return;
        }

        $authorizationHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];

        if (!$authorizationHeader) {
            throw new AuthorizationException();
        }

        $parts = explode(' ', $authorizationHeader);
        if (count($parts) !== 2 || $parts[0] !== 'Serlo') {
            throw new AuthorizationException();
        }

        $serviceTokenParts = explode('=', $parts[1]);
        if (
            count($serviceTokenParts) !== 2 ||
            $serviceTokenParts[0] !== 'Service'
        ) {
            throw new AuthorizationException();
        }

        $serviceToken = $serviceTokenParts[1];

        if (!$this->validateToken($serviceToken)) {
            throw new AuthorizationException();
        }
    }

    /**
     * @param string $token
     * @return bool
     */
    protected function validateToken(string $token)
    {
        try {
            $token = (new Parser())->parse($token);

            $data = new ValidationData();
            $data->setIssuer('api.serlo.org');
            $data->setAudience('serlo.org');

            if (!$token->validate($data)) {
                return false;
            }
            return $token->verify(new Sha256(), $this->options['secret']);
        } catch (Exception $e) {
            return false;
        }
    }
}
