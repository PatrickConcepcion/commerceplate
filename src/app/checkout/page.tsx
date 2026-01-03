import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const cartId = (await cookies()).get("cartId")?.value;
  let cart;

  if (cartId) {
    try {
      cart = await getCart(cartId);
    } catch (error) {
      console.error(error);
    }
  }

  return <CheckoutClient cart={cart} />;
}