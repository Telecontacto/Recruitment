import { NextResponse } from 'next/server';
import { attendantStatus } from '@/app/lib/definitions'; // Assuming this type exists
import { executeQuery } from '@/app/lib/data-mssql'; // Ensure this utility works as intended

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate'); // Get the query parameter

  if (!startDate) {
    return NextResponse.json({ error: 'Start date is required' }, { status: 400 });
  }

  try {
    const query = `
      SELECT 
        a.nombre,
        a.id,
        a.statussolicitud
      FROM
        RECLUTAMIENTO_SOLICITUDES a
      WHERE
        cast(a.fecha as date) like @param1
      ORDER BY
        a.fecha DESC
    `;
    const params = [`${startDate}%`];

    const result = await executeQuery<attendantStatus[]>(query, params);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in query execution:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
