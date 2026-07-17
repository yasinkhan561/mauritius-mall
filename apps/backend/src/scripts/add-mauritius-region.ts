import { MedusaContainer } from "@medusajs/framework"
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function addMauritiusRegion({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve("logger")

  logger.info("Creating Mauritius region...")

  await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Mauritius",
          currency_code: "mur",
          countries: ["mu"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })

  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "mu", provider_id: "tp_system" }],
  })

  logger.info("Mauritius region created.")
}
