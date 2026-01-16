<?php
declare(strict_types=1);

namespace VioCustomerPrice\Subscriber;

use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Checkout\Customer\CustomerEntity;
use Shopware\Core\Content\Category\Event\CategoryRouteCacheKeyEvent;
use Shopware\Core\Content\Product\Events\CrossSellingRouteCacheKeyEvent;
use Shopware\Core\Content\Product\Events\ProductDetailRouteCacheKeyEvent;
use Shopware\Core\Content\Product\Events\ProductListingRouteCacheKeyEvent;
use Shopware\Core\Content\Product\Events\ProductSearchRouteCacheKeyEvent;
use Shopware\Core\Content\Product\Events\ProductSuggestRouteCacheKeyEvent;
use Shopware\Core\Framework\Adapter\Cache\StoreApiRouteCacheKeyEvent;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use VioCustomerPrice\Struct\HasCustomerPriceStruct;

class CacheKeySubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly EntityRepository $customerPriceRepository
    )
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ProductDetailRouteCacheKeyEvent::class => 'addCustomerPart',
            ProductListingRouteCacheKeyEvent::class => 'addCustomerPart',
            ProductSearchRouteCacheKeyEvent::class => 'addCustomerPart',
            ProductSuggestRouteCacheKeyEvent::class => 'addCustomerPart',
            CrossSellingRouteCacheKeyEvent::class => 'addCustomerPart',
            CategoryRouteCacheKeyEvent::class => 'addCustomerPart'
        ];
    }

    public function addCustomerPart(StoreApiRouteCacheKeyEvent $event): void
    {
        $context = $event->getContext();
        if($context->getCustomer() instanceof CustomerEntity) {
            // check if customer has any customer price
            if(!$context->hasExtensionOfType('hasCustomerPrice', HasCustomerPriceStruct::class)) {
                $hasCustomerPrice = $this->customerPriceRepository->searchIds(
                        (new Criteria())
                            ->addFilter(
                                new EqualsFilter('customerId', $context->getCustomer()->getId())
                            )
                            ->setLimit(1)
                        , $context->getContext()
                    )->firstId() !== null;
                $context->addExtension('hasCustomerPrice', new HasCustomerPriceStruct($hasCustomerPrice));
            }
            else {
                /** @var HasCustomerPriceStruct $extension */
                $extension = $context->getExtensionOfType('hasCustomerPrice', HasCustomerPriceStruct::class);
                $hasCustomerPrice = $extension->getHasCustomerPrice();
            }
            if ($hasCustomerPrice) {
                $event->addPart($context->getCustomer()->getId());
            }
        }
    }
}
