<?php
declare(strict_types=1);

use Frosh\Rector\Set\ShopwareSetList;
use Rector\Config\RectorConfig;

return RectorConfig::configure()
    ->withPaths([__DIR__ . '/src'])
    ->withPhpSets(php83: true)
    ->withSets([
        ShopwareSetList::SHOPWARE_6_6_0,
    ]);
