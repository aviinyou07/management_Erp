const pool = require("../config/db");
const { getPostedText } = require("../utils/timeHelper");

async function getCompanies() {
  const [rows] = await pool.query(`
    SELECT
      c.id,
      c.name,
      c.initials,
      c.logo,
      c.employees_count_text,
      COUNT(j.id) AS openings_count
    FROM companies c
    LEFT JOIN jobs j
      ON c.id = j.company_id
      AND j.status = 'active'
    GROUP BY c.id, c.name, c.initials, c.logo, c.employees_count_text
    ORDER BY c.name ASC
  `);

  return rows;
}

async function getCompanyById(id) {
  const [rows] = await pool.query(`
    SELECT
      c.id,
      c.name,
      c.initials,
      c.logo,
      c.employees_count_text,
      COUNT(j.id) AS openings_count
    FROM companies c
    LEFT JOIN jobs j
      ON c.id = j.company_id
      AND j.status = 'active'
    WHERE c.id = ?
    GROUP BY c.id, c.name, c.initials, c.logo, c.employees_count_text
    LIMIT 1
  `, [id]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

async function getCompanyJobs(id) {
  const [rows] = await pool.query(`
    SELECT
      j.id,
      j.title,
      j.location_text,
      j.posted_at,
      j.status
    FROM jobs j
    WHERE j.company_id = ?
      AND j.status = 'active'
    ORDER BY j.posted_at DESC
  `, [id]);

  return rows.map((job) => ({
    id: job.id,
    title: job.title,
    location_text: job.location_text,
    posted_text: getPostedText(job.posted_at),
    status: job.status
  }));
}

module.exports = {
  getCompanies,
  getCompanyById,
  getCompanyJobs
};