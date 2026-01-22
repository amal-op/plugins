<?php
declare(strict_types=1);

namespace VioCustomerPrice\Subscriber;

use Shopware\Core\Defaults;
use Shopware\Core\System\SalesChannel\Entity\SalesChannelEntityLoadedEvent;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use VioCustomerPrice\Entity\CustomerPriceCollection;

readonly class SalesChannelProductSubscriber implements EventSubscriberInterface
{

    public function __construct(
        private SystemConfigService $systemConfigService
    )
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'sales_channel.product.loaded' => ['onProductLoaded', 100]
        ];
    }

    public function onProductLoaded(SalesChannelEntityLoadedEvent $event): void
    {
        $context = $event->getSalesChannelContext();
        if ($context->getCurrencyId() === Defaults::CURRENCY
            || !$this->systemConfigService->getBool('VioCustomerPrice.config.currencyConversion', $context->getSalesChannelId())
        ) {
            return;
        }
        $factor = $context->getCurrency()->getFactor();
        /** @var SalesChannelEntityLoadedEvent $product */
        foreach ($event->getEntities() as $product) {
            // Do something with the product
            if(!$product->hasExtension('customerPrices')) {
                continue;
            }
            /** @var CustomerPriceCollection $customerPricesCollection */
            $customerPricesCollection = $product->getExtension('customerPrices');
            foreach ($customerPricesCollection as $price) {
                if($price->getPrice() === null) {
                    continue;
                }
                $price->setPrice($price->getPrice() * $factor);
            }
        }
    }
}