exports.handler = async function () {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula={Status}='Listed'`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
    });

    const data = await response.json();

    const vendors = data.records.map((r) => ({
      name: r.fields["Business Name"],
      category: r.fields["Category"],
      description: r.fields["Description"],
      serviceArea: r.fields["Service Area"],
      phone: r.fields["Phone"],
      website: r.fields["Website"] || "#",
      featured: r.fields["Featured"] || false,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(vendors),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load vendors" }),
    };
  }
};
