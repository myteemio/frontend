'use client';
import { FrontPageActivity } from '@/components/FrontPageActivity/FrontPageActivity';
import { MultiSelectCities } from '@/components/MultiSelectCities.component';
import { ActivityGrid } from '@/components/StyledComponents/ActivityGrid';
import { IActivity, useActivities } from '@/lib/useActivity';
import { Autocomplete, Box, Slider, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getActivitySearchOptions } from '../utils/activity';

export default function Start() {
  const { activities, isLoading } = useActivities();
  const searchParams = useSearchParams();
  const [citiesLoading, setCitiesLoading] = useState<boolean>(true);
  const [activityCities, setActivityCities] = useState<string[]>([]);
  const [activityNames, setActivityNames] = useState<string[]>([]);
  const [activityPrices, setActivityPrices] = useState<number[]>([]);
  const [activityPricesRange, setActivityPricesRange] = useState<number[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    if (!isLoading && activities?.activities) {
      const { cities, activityNames, activityPrices } = getActivitySearchOptions(
        activities?.activities
      );
      setActivityCities(cities.sort());
      setActivityNames(activityNames.sort());
      setActivityPrices([Math.min(...activityPrices), Math.max(...activityPrices)]);
      setCitiesLoading(false);
    }
  }, [isLoading, activities]);

  useEffect(() => {
    const cities = searchParams.get('city');
    const selectedCities = cities ? cities.split(',') : [];
    const filteredCities = activities?.activities.filter((activity) =>
      selectedCities.length > 0 ? selectedCities.includes(activity.address.city) : true
    );
    const filteredName = filteredCities?.filter((activity) =>
      search === '' ? filteredCities : activity.name.toLowerCase().includes(search.toLowerCase())
    );

    const filtered = filteredName?.filter((activity) =>
      activityPricesRange.length === 0
        ? activity.price >= activityPrices[0] && activity.price <= activityPrices[1]
        : activity.price >= activityPricesRange[0] && activity.price <= activityPricesRange[1]
    );

    setFilteredActivities(filtered || []);
  }, [activities, search, activityPricesRange, activityPrices, searchParams]);

  return (
    <Box width="100%" minHeight={'3000px'}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'center'}
        mt={2}
        mb={5}
      >
        <Typography
          fontSize={{ xs: '24px', sm: '48px', xl: '64px' }}
          variant="h3"
          color={'primary'}
          fontWeight={'bold'}
        >
          Vælg Aktiviteter
        </Typography>
        <Typography fontSize={{ xs: '12px', sm: '16px', xl: '24px' }}>
          Vælg de potentielle aktiviteter du ønsker at lave til dit event
        </Typography>
        <Box display={'flex'} justifyContent={'space-between'} height={200} width={700}>
          <Autocomplete
            clearOnEscape
            clearOnBlur={false}
            id="combo-box-demo"
            options={activityNames}
            sx={{ width: 700 }}
            renderInput={(params) => <TextField {...params} label="Søg Aktiviteter" />}
            onChange={(_, value) => {
              setSearch(value || '');
            }}
          />
          <MultiSelectCities cities={activityCities} citiesLoading={citiesLoading} />
          <Box sx={{ width: 500 }}>
            <Slider
              step={1}
              value={activityPricesRange.length === 0 ? activityPrices : activityPricesRange}
              valueLabelDisplay="auto"
              onChange={(_, value) => setActivityPricesRange(value as number[])}
              min={activityPrices[0]}
              max={activityPrices[1]}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                {activityPricesRange.length === 0 ? activityPrices[0] : activityPricesRange[0]} DKK
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                {activityPricesRange.length === 0 ? activityPrices[1] : activityPricesRange[1]} DKK
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display={'flex'} justifyContent={'center'} flexGrow={1}>
        <ActivityGrid container width={'95%'} pl={4} pr={4} spacing={5}>
          {filteredActivities.map((activity: IActivity, i) => {
            return (
              <Grid2 key={i} sm={12} md={6} lg={4} xl={3}>
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
