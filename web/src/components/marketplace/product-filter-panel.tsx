import type { Category, PaymentType } from "@/types";

export const locationOptions = [
  "Accra",
  "Tema",
  "Kumasi",
  "Cape Coast",
  "Takoradi",
  "Koforidua",
  "Tamale",
] as const;

export const paymentTypeOptions: PaymentType[] = [
  "Full Payment",
  "Partial Payment",
  "Pre-order",
  "Payment on Delivery",
];

export type AvailabilityFilter = "all" | "in-stock" | "out-of-stock";

export interface CatalogueFilters {
  search: string;
  categoryIds: string[];
  subcategoryIds: string[];
  minPrice: string;
  maxPrice: string;
  location: string;
  rating: number;
  paymentTypes: PaymentType[];
  availability: AvailabilityFilter;
}

interface ProductFilterPanelProps {
  filters: CatalogueFilters;
  idPrefix: string;
  hideCategoryFilter?: boolean;
  categories: Category[];
  onChange: (filters: CatalogueFilters) => void;
  onClear: () => void;
}

export function ProductFilterPanel({
  filters,
  idPrefix,
  hideCategoryFilter = false,
  categories,
  onChange,
  onClear,
}: ProductFilterPanelProps) {
  function toggleCategory(id: string) {
    onChange({
      ...filters,
      categoryIds: filters.categoryIds.includes(id)
        ? filters.categoryIds.filter((value) => value !== id)
        : [...filters.categoryIds, id],
      subcategoryIds: [],
    });
  }

  function toggleSubcategory(id: string) {
    onChange({
      ...filters,
      subcategoryIds: filters.subcategoryIds.includes(id)
        ? filters.subcategoryIds.filter((value) => value !== id)
        : [...filters.subcategoryIds, id],
    });
  }

  const mainCategories = categories.filter((category) => !category.parentCategoryId && category.isActive);
  const subcategories = categories.filter(
    (category) => category.parentCategoryId && category.isActive &&
      (filters.categoryIds.length === 0 || filters.categoryIds.includes(category.parentCategoryId)),
  );

  function togglePaymentType(paymentType: PaymentType) {
    onChange({
      ...filters,
      paymentTypes: filters.paymentTypes.includes(paymentType)
        ? filters.paymentTypes.filter((value) => value !== paymentType)
        : [...filters.paymentTypes, paymentType],
    });
  }

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-black text-slate-950">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-extrabold text-emerald-700 hover:text-emerald-900"
        >
          Clear filters
        </button>
      </div>

      {!hideCategoryFilter ? (
        <fieldset className="border-t border-slate-200 pt-6">
          <legend className="mb-3 text-sm font-extrabold text-slate-900">Category</legend>
          <div className="max-h-52 space-y-2.5 overflow-y-auto pr-2">
            {mainCategories.map((category) => {
              const id = `${idPrefix}-category-${category.slug}`;
              return (
                <label key={category.id} htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                  <input
                    id={id}
                    type="checkbox"
                    checked={filters.categoryIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="size-4 rounded border-slate-300 accent-emerald-700"
                  />
                  <span className="flex-1">{category.name}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {subcategories.length ? (
        <fieldset className="border-t border-slate-200 pt-6">
          <legend className="mb-3 text-sm font-extrabold text-slate-900">Subcategory</legend>
          <div className="max-h-44 space-y-2.5 overflow-y-auto pr-2">
            {subcategories.map((category) => {
              const id = `${idPrefix}-subcategory-${category.id}`;
              return (
                <label key={category.id} htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                  <input id={id} type="checkbox" checked={filters.subcategoryIds.includes(category.id)} onChange={() => toggleSubcategory(category.id)} className="size-4 rounded border-slate-300 accent-emerald-700" />
                  <span className="flex-1">{category.name}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <fieldset className="border-t border-slate-200 pt-6">
        <legend className="mb-3 text-sm font-extrabold text-slate-900">Price range (GH₵)</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${idPrefix}-min-price`} className="sr-only">Minimum price</label>
            <input
              id={`${idPrefix}-min-price`}
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.minPrice}
              onChange={(event) => onChange({ ...filters, minPrice: event.target.value })}
              placeholder="Min"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-max-price`} className="sr-only">Maximum price</label>
            <input
              id={`${idPrefix}-max-price`}
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.maxPrice}
              onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })}
              placeholder="Max"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </fieldset>

      <div className="border-t border-slate-200 pt-6">
        <label htmlFor={`${idPrefix}-location`} className="text-sm font-extrabold text-slate-900">
          Location
        </label>
        <select
          id={`${idPrefix}-location`}
          value={filters.location}
          onChange={(event) => onChange({ ...filters, location: event.target.value })}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500"
        >
          <option value="">All locations</option>
          {locationOptions.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      <fieldset className="border-t border-slate-200 pt-6">
        <legend className="mb-3 text-sm font-extrabold text-slate-900">Minimum rating</legend>
        <div className="space-y-2.5">
          {[4, 3, 0].map((rating) => {
            const id = `${idPrefix}-rating-${rating}`;
            return (
              <label key={rating} htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                <input
                  id={id}
                  type="radio"
                  name={`${idPrefix}-rating`}
                  checked={filters.rating === rating}
                  onChange={() => onChange({ ...filters, rating })}
                  className="size-4 accent-emerald-700"
                />
                <span>{rating === 0 ? "All ratings" : <><span className="text-amber-500">★</span> {rating}.0 and above</>}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border-t border-slate-200 pt-6">
        <legend className="mb-3 text-sm font-extrabold text-slate-900">Payment type</legend>
        <div className="space-y-2.5">
          {paymentTypeOptions.map((paymentType) => {
            const id = `${idPrefix}-payment-${paymentType.toLowerCase().replaceAll(" ", "-")}`;
            return (
              <label key={paymentType} htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                <input
                  id={id}
                  type="checkbox"
                  checked={filters.paymentTypes.includes(paymentType)}
                  onChange={() => togglePaymentType(paymentType)}
                  className="size-4 rounded border-slate-300 accent-emerald-700"
                />
                {paymentType}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border-t border-slate-200 pt-6">
        <legend className="mb-3 text-sm font-extrabold text-slate-900">Availability</legend>
        <div className="space-y-2.5">
          {[
            ["all", "All products"],
            ["in-stock", "In stock"],
            ["out-of-stock", "Out of stock"],
          ].map(([value, label]) => {
            const id = `${idPrefix}-availability-${value}`;
            return (
              <label key={value} htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                <input
                  id={id}
                  type="radio"
                  name={`${idPrefix}-availability`}
                  checked={filters.availability === value}
                  onChange={() => onChange({ ...filters, availability: value as AvailabilityFilter })}
                  className="size-4 accent-emerald-700"
                />
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
