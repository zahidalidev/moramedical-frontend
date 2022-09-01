import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { isEmpty } from 'lodash'
import { Paper } from '@mui/material'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { useState } from 'react'

import { AppBar } from 'components'
import { fetchAllEvents, subscribeEvent, unsubscribeEvent } from 'api/events'
import LoadingModal from 'components/LoadingModal'
import { useSession } from 'next-auth/react'

import styles from './styles.module.scss'

const Events = ({ events }) => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const handleAddSubscription = async (eventId) => {
    setLoading(true)
    const userEmail = session.user.email
    const res = await subscribeEvent(eventId, userEmail)
    if (!isEmpty(res)) {
      toast.success('Event Subscribed')
    } else {
      toast.error('Event not Subscribed')
    }
    setLoading(false)
  }

  const handleRemoveSubscription = async (eventId) => {
    setLoading(true)
    const userEmail = session.user.email
    const res = await unsubscribeEvent(eventId, userEmail)
    if (!isEmpty(res)) {
      toast.success('Event Unsubscribed')
    } else {
      toast.error('Event not Unsubscribed')
    }
    setLoading(false)
  }

  return (
    <>
      <AppBar />
      <LoadingModal show={loading} />
      <Box className={styles.container}>
        <Typography variant='h4'>All Public Events</Typography>
        <Box className={styles.eventsContainer}>
          {events?.map((event) => (
            <Paper key={event.id} elevation={3} className={styles.card}>
              <CardContent>
                <Typography variant='h5' component='div'>
                  {event.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  Host: {event.hostDoctorName}
                </Typography>
                <Typography variant='body2'>{event.description}</Typography>
                <Box className={styles.dateBox}>
                  <Typography className={styles.startDate} size='small'>
                    {event.startDate}
                  </Typography>
                  <Typography className={styles.duration} size='small'>
                    from {event.duration}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions className={styles.cardAction}>
                <Button
                  onClick={() => handleAddSubscription(event.id)}
                  variant='outlined'
                  size='small'
                >
                  Subscribe event
                </Button>
                <Button onClick={() => handleRemoveSubscription(event.id)} variant='outlined' size='small'>
                  Unsubscribe event
                </Button>
              </CardActions>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  )
}

export const getStaticProps = async () => {
  const events = await fetchAllEvents()
  return {
    props: {
      events,
    },
    revalidate: 10,
  }
}

export default Events
