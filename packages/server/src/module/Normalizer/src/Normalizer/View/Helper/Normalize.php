<?php
/**
 * This file is part of Athene2.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2 for the canonical source repository
 */
namespace Normalizer\View\Helper;

use Common\Filter\PreviewFilter;
use Instance\Manager\InstanceManagerAwareTrait;
use Markdown\Service\OryRenderService;
use Markdown\View\Helper\MarkdownHelper;
use Markdown\View\Helper\OryFormatHelper;
use Normalizer\NormalizerAwareTrait;
use Ui\View\Helper\Brand;
use Zend\View\Helper\AbstractHelper;
use Zend\View\Helper\HeadMeta;
use Zend\View\Helper\HeadTitle;

class Normalize extends AbstractHelper
{
    use InstanceManagerAwareTrait;
    use NormalizerAwareTrait;

    public function __invoke($object = null)
    {
        if ($object === null) {
            return $this;
        }
        return $this->normalize($object);
    }

    public function headMeta($object)
    {
        $meta = $this->getView()->plugin('headMeta');
        $normalized = $this->normalize($object);

        $type = $normalized->getType();
        $metadata = $normalized->getMetadata();

        $keywords = $metadata->getKeywords();
        $robots = $metadata->getRobots();

        $meta->appendName('content_type', $type);
        $meta->appendName('description', $this->getMetaDescription($object));
        $meta->appendName('keywords', implode(', ', $keywords));
        $meta->appendName('robots', $robots);

        $this->appendOpenSearchMeta($object);
        $this->appendOpenGraphMeta($object);
        $this->appendFacebookMeta($object);

        return $this;
    }

    private function appendOpenSearchMeta($object)
    {
        $lang = $this->getSubdomain();

        if ($lang === 'de' || $lang === 'en') {
            $this->getView()->headLink(
                [
                    'rel' => 'search',
                    'href' => '/opensearch.' . $lang . '.xml',
                    'title' => 'Serlo (' . $lang . ')',
                    'type' => 'application/opensearchdescription+xml',
                ]
            );
        }
    }

    private function appendOpenGraphMeta($object)
    {
        $meta = $this->getMeta();

        $meta->setProperty('og:title', $this->normalize($object)->getTitle());
        $meta->setProperty('og:type', 'website');
        $meta->setProperty('og:image', $this->getMetaImage($object));
        $meta->setProperty('og:description', $this->getMetaDescription($object));
        $meta->setProperty('og:site_name', $this->getView()->brand()->getBrand(true));
    }

    private function appendFacebookMeta($object)
    {
        $meta = $this->getMeta();

        $meta->setProperty('fb:pages', '155020041197918');
        $meta->setProperty('fb:profile_id', '155020041197918');
    }


    private function getMetaDescription($object)
    {
        $metadata = $this->normalize($object)->getMetadata();
        return $this->renderPreview($metadata->getMetaDescription());
    }

    private function getMetaImage($object)
    {
        $fileName = 'meta/serlo.jpg';

        $subject = trim(strtolower(strip_tags(
            $this->getView()->navigation('default_navigation')
                ->menu()
                ->setPartial('layout/navigation/partial/active-subject')
                ->setOnlyActiveBranch(true)
                ->setMinDepth(0)
                ->setMaxDepth(0)
                ->render()
        )));

        switch ($subject) {
            case 'mathematik':
                $fileName = 'de/meta/mathematik.jpg';
                break;

            case 'angewandte nachhaltigkeit':
                $fileName = 'de/meta/angewandte-nachhaltigkeit.jpg';
                break;

            case 'biologie':
                $fileName = 'de/meta/biologie.jpg';
                break;
        }

        return $this->getView()->assets()->getAsset($fileName);
    }

    private function getSubdomain()
    {
        return $this->getInstanceManager()->getInstanceFromRequest()->getSubdomain();
    }

    /**
     * @return HeadMeta
     */
    private function getMeta()
    {
        return $this->getView()->plugin('headMeta');
    }

    public function headTitle($object)
    {
        /* @var $headTitle HeadTitle */
        $headTitle  = $this->getView()->plugin('headTitle');
        if (is_string($object)) {
            $headTitle($object);
        } else {
            $normalized = $this->normalize($object);
            $headTitle($normalized->getMetadata()->getTitle());
        }
        return $this;
    }

    public function appendBrand()
    {
        /** @var Brand $brand */
        $brand  = $this->getView()->brand();
        /* @var $headTitle HeadTitle */
        $headTitle  = $this->getView()->plugin('headTitle');
        $title = $headTitle->renderTitle();
        $maxStringLen = 65;

        if (!$title) {
            $headTitle($brand->getBrand(true));
            $headTitle($brand->getSlogan(true));
            return $this;
        }
        //add "– lernen mit Serlo"
        $titlePostfix = $brand->getHeadTitle(true);
        if (strlen($title) < ($maxStringLen-strlen($titlePostfix))) {
            $headTitle($titlePostfix);
            return $this;
        }

        $titlePostfixFallback = $brand->getBrand(true);
        if (strlen($title) < ($maxStringLen-strlen($titlePostfixFallback))) {
            $headTitle($titlePostfixFallback);
            return $this;
        }

        return $this;
    }

    public function possible($object)
    {
        try {
            $this->normalize($object);
        } catch (\Exception $e) {
            return false;
        }

        return true;
    }

    public function toAnchor($object, $forceCanonical = false)
    {
        $normalized = $this->normalize($object);
        return '<a href="' . $this->toUrl($object, $forceCanonical) . '">' . $normalized->getTitle() . '</a>';
    }

    public function toAuthor($object)
    {
        return $this->normalize($object)->getMetadata()->getAuthor();
    }

    public function toCreationDate($object)
    {
        return $this->normalize($object)->getMetadata()->getCreationDate();
    }

    public function toLastModified($object)
    {
        return $this->normalize($object)->getMetadata()->getLastModified();
    }

    public function toPreview($object)
    {
        $normalized = $this->normalize($object);
        $content    = $normalized->getMetadata()->getDescription();
        return $this->renderPreview($content);
    }

    private function renderPreview($string)
    {
        $isOryEditorFormat = $this->getView()->plugin('isOryEditorFormat');
        /** @var MarkdownHelper $renderer */
        $renderer = $isOryEditorFormat($string)
            ? $this->getView()->plugin('oryRenderer')
            : $this->getView()->plugin('markdown');
        $content =  $renderer->toHtml($string);
        $filter     = new PreviewFilter(152);
        $preview    = $filter->filter($content);
        return $preview;
    }

    public function toTitle($object)
    {
        return $this->normalize($object)->getTitle();
    }

    public function toType($object)
    {
        return $this->normalize($object)->getType();
    }

    public function toUrl($object, $forceCanonical = false)
    {
        $normalized = $this->normalize($object);
        return $this->getView()->url(
            $normalized->getRouteName(),
            $normalized->getRouteParams(),
            ['force_canonical' => $forceCanonical]
        );
    }

    protected function normalize($object)
    {
        return $this->getNormalizer()->normalize($object);
    }
}
