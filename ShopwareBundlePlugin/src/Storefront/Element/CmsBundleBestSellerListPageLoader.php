<?php

declare(strict_types=1);

namespace ShopwareBundlePlugin\Storefront\Element;

use Symfony\Component\HttpFoundation\Request;
use Shopware\Storefront\Page\GenericPageLoader;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Storefront\Framework\Page\StorefrontSearchResult;
use Shopware\Core\Content\Cms\DataResolver\FieldConfigCollection;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use ShopwareBundlePlugin\Storefront\Element\CmsBundleBestSellerListPage;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\Framework\Struct\ArrayStruct;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Grouping\FieldGrouping;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\SumAggregation;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\NotFilter;

class CmsBundleBestSellerListPageLoader
{
    private GenericPageLoader $genericLoader;
    private EntityRepository $orderLineItemRepository;

    public function __construct(
        EntityRepository $orderLineItemRepository,
        GenericPageLoader $genericLoader
    ) {
        $this->orderLineItemRepository = $orderLineItemRepository;
        $this->genericLoader = $genericLoader;
    }

    public function load(Request $request, SalesChannelContext $salesChannelContext, FieldConfigCollection $config): CmsBundleBestSellerListPage
    {
        $page = $this->genericLoader->load($request, $salesChannelContext);
        $page = CmsBundleBestSellerListPage::createFrom($page);
        $page->setNavigationId($request->get('navigationId'));
        $searchTerm = $request->query->get('searchTerm');

        if (!empty($searchTerm)) {
            $page->setSearchTerm($searchTerm);
        }

        $orderItems = $this->orderLineItemRepository->search(
            $this->createCriteria($config, $request, $page),
            $salesChannelContext->getContext()
        );

        $products = [];
        foreach ($orderItems->getEntities() as $bestSeller) {
            $products[] = $bestSeller->getProduct();
        }

        $page->setProduct(StorefrontSearchResult::createFrom(new ArrayStruct($products)));

        return $page;
    }

    private function createCriteria(FieldConfigCollection $config, Request $request, CmsBundleBestSellerListPage $page): Criteria
    {
        $criteria = new Criteria();
        $criteria->addAssociation('product.cover');
        $criteria->addFilter(new EqualsFilter('type', 'product'));
        $criteria->addFilter(new NotFilter(NotFilter::CONNECTION_AND, [
            new EqualsFilter('product.id', null),
        ]));
        $criteria->addGroupField(new FieldGrouping('productId'));
        $criteria->addAggregation(new SumAggregation('quantity', 'quantity'));
        $criteria->addSorting(new FieldSorting('quantity', FieldSorting::DESCENDING));
        $limit = $config->get('productsPerPage')->getValue();
        if ($limit) {
            $criteria->setLimit((int) $limit);
        }

        return $criteria;
    }
}
