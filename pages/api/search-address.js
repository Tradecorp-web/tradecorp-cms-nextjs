// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { googleMapApiKey } from "../../helpers/api_key"

export default async (req, res) => {
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req?.query?.input}&key=${googleMapApiKey}&language=en`

  try {
    var response = await fetch(
      url,
      {method: "GET"}
    )
    const jsonData = await response.json()
    res.status(200).json(jsonData)
  } catch (err) {
    res.status(400).json({error: "Error"})
  }
}