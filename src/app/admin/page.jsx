import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import connectToDB from '@/lib/mongodb'
import Workshop from '../../../models/Workshop'
import Session from '../../../models/Session'
import AdminWorkshopPage from './AdminWorkshopPage'

const ManageWorkshopsPage = async () => {

  await connectToDB();
    
  let workshops = [];
  try {
    // Fetch all workshops
    workshops = await Workshop.find({}).lean();

    // Fetch corresponding sessions for each workshop
    workshops = await Promise.all(
      workshops.map(async (workshop) => {
        // Fetch sessions for the current workshop
        const sessions = await Session.find({ workshopId: workshop._id }).lean();

        // Convert _id and date fields to strings
        const formattedSessions = sessions.map((session) => ({
          ...session,
          _id: session._id.toString(),
          workshopId: session.workshopId.toString(),
          date: session.date?.toISOString?.() || null,
          participants: session.participants?.map((participant) => participant.toString()) || [],
        }));

        return {
          ...workshop,
          _id: workshop._id.toString(),
          createdAt: workshop.createdAt?.toISOString?.() || null,
          updatedAt: workshop.updatedAt?.toISOString?.() || null,
          sessions: formattedSessions, 
        };
      })
    );
  } catch (error) {
    console.error("Error fetching workshops or sessions:", error);
  }

  // console.log('workshops::::', workshops)
  // console.log('sessions::::', workshops[0].sessions)


  // Pass the fetched data to a Client Component
  return (
    <AdminWorkshopPage courses={workshops} />
  );
}

export default ManageWorkshopsPage