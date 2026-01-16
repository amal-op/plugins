<?php
declare(strict_types=1);

namespace VioCustomerPrice\Subscriber;

use Shopware\Core\Defaults;
use Shopware\Core\System\SalesChannel\Entity\SalesChannelEntityLoadedEvent;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use VioCustomerPrice\Entity\CustomerPriceCollection;

class SalesChannelProductSubscriber implements EventSubscriberInterface
{

    public function __construct(
        private readonly SystemConfigService $systemConfigService
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
        if (!$this->systemConfigService->getBool('VioCustomerPrice.config.currencyConversion')
            || $event->getSalesChannelContext()->getCurrencyId() === Defaults::CURRENCY
        ) {
            return;
        }
        $factor = $event->getSalesChannelContext()->getCurrency()->getFactor();
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