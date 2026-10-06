import { z } from 'zod';

export const ComponentConditionEnum = z.enum([
  'new',
  'like_new',
  'used_functional',
  'untested',
  'for_parts',
]);

export const ListingModeEnum = z.enum(['sell', 'rent', 'donate']);
export const OrderTypeEnum = z.enum(['buy', 'rent', 'donate']);
export const EWasteRouteEnum = z.enum([
  'recycling_partner_demo',
  'component_harvesting',
  'community_collection',
]);

// 1. Component Vision Analysis Schema
export const AIComponentAnalysisSchema = z.object({
  probable_name: z.string().min(2).max(100),
  category: z.string().min(2).max(60),
  possible_model: z.string().max(80).optional(),
  visible_condition: ComponentConditionEnum,
  observations: z.array(z.string()).min(1),
  suggested_tags: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
  safety_warning: z.string().nullable().optional(),
});

// 2. Listing Form Submission Schema
export const CreateListingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  component_id: z.string().optional(),
  condition: ComponentConditionEnum,
  quantity: z.number().int().positive('Quantity must be at least 1'),
  mode: ListingModeEnum,
  price: z.number().min(0, 'Price must be non-negative').default(0),
  rent_per_day: z.number().min(0, 'Rent per day must be non-negative').default(0),
  mass_g: z.number().positive('Mass in grams must be greater than 0'),
  tags: z.array(z.string()).default([]),
  image_url: z.string().url().optional().or(z.literal('')),
}).refine((data) => {
  if (data.mode === 'sell' && data.price <= 0) {
    return false;
  }
  if (data.mode === 'rent' && data.rent_per_day <= 0) {
    return false;
  }
  return true;
}, {
  message: 'Sell mode requires a price > 0, Rent mode requires rent_per_day > 0',
  path: ['price'],
});

// 3. Order Placement Schema
export const CreateOrderSchema = z.object({
  listing_id: z.string().min(1, 'Listing ID is required'),
  qty: z.number().int().positive('Quantity must be greater than 0'),
  type: OrderTypeEnum,
});

// 4. Handover Confirmation Schema
export const HandoverConfirmSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  code: z.string().length(4, 'Confirmation code must be 4 digits'),
  role: z.enum(['buyer', 'seller']),
});

// 5. E-Waste Submission Schema
export const CreateEWasteSchema = z.object({
  category: z.string().min(2, 'Category is required'),
  weight_g: z.number().min(100, 'Minimum e-waste batch is 100g'),
  route: EWasteRouteEnum,
  notes: z.string().max(500).optional(),
});

// 6. AI Assistant Chat Schema
export const AIChatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  role: z.enum(['buyer', 'seller', 'user']).default('user'),
  context: z.record(z.any()).optional(),
});
