exports.handler = async function () {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=${encodeURIComponent("{Status}='Listed'")}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Airtable request failed",
          status: response.status,
          airtableMessage: data,
        }),
      };
    }

    const vendors = data.records.map((r) => ({
      name: r.fields["Business Name"] || "",
      category: r.fields["Category"] || "",
      description: r.fields["Description"] || "",
      serviceArea: r.fields["Service Area"] || "",
      phone: r.fields["Phone"] || "",
      website: r.fields["Website"] || "#",
      featured: r.fields["Featured"] || false,
      plan: r.fields["Plan"] || "Free",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(vendors),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Function crashed",
        message: err.message,
      }),
    };
  }
};
