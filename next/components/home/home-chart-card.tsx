import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../shared/ui/card'
import { Circle } from 'lucide-react'

type HomeChartCardProps = {
    title: string
    description: string
    chart: React.ReactNode
}

const LegendDisplaySlot = ({children}: {children: React.ReactNode}) => {
    return (
        <div className='flex flex-row gap-2'>
            {children}
        </div>
    )
}
const LegendBadge = ({color, label}: {color: string, label: string}) => {
    return (
      <div
        style={{"--circle-stroke": color} as React.CSSProperties}
        className='flex flex-row gap-2 items-center'>
           <Circle className={`w-2 h-2 rounded-full stroke-[var(--circle-stroke)] fill-[var(--circle-stroke)]`} />
            <p className='text-xs text-muted-foreground font-medium'>{label}</p>
        </div>
    )
}
const HomeChartCard = ({title, description, chart}: HomeChartCardProps) => {
  return (
    <Card className='shadow-none rounded-none bg-transparent'>
        <CardHeader className='flex flex-row justify-between'>
            <CardTitle>
                {title}
        </CardTitle>
        <LegendDisplaySlot>
            <LegendBadge color='red' label='Red' />
            <LegendBadge color='blue' label='Blue' />
        </LegendDisplaySlot>
      </CardHeader>
      <CardContent>
        {chart}
      </CardContent>
    </Card>
  )
}

export default HomeChartCard