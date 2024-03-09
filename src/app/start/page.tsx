'use client';
import { FrontPageActivity } from '@/components/FrontPageActivity/FrontPageActivity';
import { MultiSelectCities } from '@/components/MultiSelectCities.component';
import { ActivityGrid } from '@/components/StyledComponents/ActivityGrid';
import { IActivity, useActivities } from '@/lib/useActivity';
import { Autocomplete, Box, Slider, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { filterActivityByCity, filterActivityByName, filterActivityByPrice, getActivitySearchOptions } from '../utils/activity';
import { StyledBox } from '@/components/StyledComponents/FiltersBox';

export default function Start() {
  const { activities, isLoading } = useActivities();
  const searchParams = useSearchParams();
  const [citiesLoading, setCitiesLoading] = useState<boolean>(true);
  const [activityCities, setActivityCities] = useState<string[]>([]);
  const [activityNames, setActivityNames] = useState<string[]>([]);
  const [activityPricesMinMax, setActivityPricesMinMax] = useState<number[]>([]);
  const [activityPricesRange, setActivityPricesRange] = useState<number[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    if (!isLoading && activities?.activities) {
      const { cities, activityNames, activityPrices } = getActivitySearchOptions(activities?.activities);
      setActivityCities(cities.sort());
      setActivityNames(activityNames.sort());
      setActivityPricesMinMax([Math.min(...activityPrices), Math.max(...activityPrices)]);
      setCitiesLoading(false);
    }
  }, [isLoading, activities]);

  useEffect(() => {
    const cities = searchParams.get('city');
    const selectedCities = cities ? cities.split(',') : [];
    if (activities?.activities) {
      const filtered = activities.activities
        .filter((activity) => filterActivityByCity(activity, selectedCities))
        .filter((activity) => filterActivityByName(activity, search))
        .filter((activity) => filterActivityByPrice(activity, activityPricesRange, activityPricesMinMax));

      setFilteredActivities(filtered);
    }
  }, [activities, search, activityPricesRange, activityPricesMinMax, searchParams]);

  return (
    <Box width="100%" minHeight={'3000px'}>
      <Box display={'flex'} flexDirection={'column'} width={'100%'} alignItems={'center'} justifyContent={'center'} mt={2} mb={5}>
        <Typography fontSize={{ xs: '32px', sm: '48px', xl: '64px' }} variant="h3" color={'primary'} fontWeight={'bold'}>
          Vælg Aktiviteter
        </Typography>
        <Typography
          textAlign={'center'}
          width={'80%'}
          fontSize={{ xs: '12px', sm: '16px', md: '18px' }}
          sx={{ fontWeight: 'regular', whiteSpace: 'normal' }}
        >
          Vælg de potentielle aktiviteter du ønsker at lave til dit event
        </Typography>
        <StyledBox>
          <Box width={'50%'}>
            <Autocomplete
              clearOnEscape
              clearOnBlur={false}
              id="combo-box-demo"
              options={activityNames}
              renderInput={(params) => <TextField {...params} label="Søg Aktiviteter" />}
              onChange={(_, value) => {
                setSearch(value || '');
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '50%', sm: '50%', md: '25%' } }}>
            <MultiSelectCities cities={activityCities} citiesLoading={citiesLoading} />
          </Box>
          <Box width={'25%'}>
            <Slider
              step={1}
              value={activityPricesRange.length === 0 ? activityPricesMinMax : activityPricesRange}
              valueLabelDisplay="auto"
              onChange={(_, value) => setActivityPricesRange(value as number[])}
              min={activityPricesMinMax[0]}
              max={activityPricesMinMax[1]}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                {activityPricesRange.length === 0 ? activityPricesMinMax[0] : activityPricesRange[0]} DKK
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                {activityPricesRange.length === 0 ? activityPricesMinMax[1] : activityPricesRange[1]} DKK
              </Typography>
            </Box>
          </Box>
        </StyledBox>
      </Box>
      <Box display={'flex'} justifyContent={'center'} flexGrow={1}>
        <ActivityGrid container width={'95%'} pl={4} pr={4} spacing={5}>
          {filteredActivities.map((activity: IActivity, i) => {
            return (
              <Grid2 key={i} xs={12} sm={6} md={6} lg={4} xl={3}>
                <FrontPageActivity
                  name={activity.name}
                  city={activity.address.city}
                  price={activity.price}
                  persons={activity.persons}
                  activityUrl={activity.url}
                  imgUrl={'/images/goboat.png'} // TODO: Add image url when server is ready
                  isLoading={isLoading}
                />
              </Grid2>
            );
          })}
        </ActivityGrid>
      </Box>
    </Box>
  );
}
