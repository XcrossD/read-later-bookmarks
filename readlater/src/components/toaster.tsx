import { Position, Toaster } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
export const ToasterDelete = Toaster.create({
  className: "recipe-toaster",
  position: Position.BOTTOM_LEFT,
});