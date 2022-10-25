import React, {useCallback, useState, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {Calendar} from 'react-native-calendars';
import {formatDate} from './utils';
import colors from './colors';

type DateObject = {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
};

// a header component used to show a selectable calendar
const DateHeader = ({date, setDate, existingDates, open, setOpen}) => {
  const onHeaderPress = useCallback(() => {
    setOpen((c: boolean) => !c);
  }, []);

  const onDayPress = useCallback((day: DateObject) => {
    setDate(new Date(day.timestamp));
    setOpen(false); // selecting a day closes the calendar
  }, []);

  const markedDates = useMemo(() => {
    /* expected by the Calendar component to mark dates
       map taking the form { 'yyyy-mm-dd': { marked: boolean, color: string, selected: boolean }}
    */
    const existingDatesObj = Object.fromEntries(
      existingDates.map((d: string) => [
        d,
        {marked: true, color: colors.raisinBlack},
      ]),
    );
    const currentDate = formatDate(date);
    existingDatesObj[currentDate] = {
      marked: existingDates.includes(currentDate),
      selected: true,
    }; // make selected date highlighted in calendar

    const TODAY = formatDate(new Date());
    existingDatesObj[TODAY] = {
      marked: existingDates.includes(TODAY),
      selected: currentDate === TODAY, // current day is selected by default, unselect if not selected
      disabled: true,
    }; // make selected date highlighted in calendar
    return existingDatesObj;
  }, [date, existingDates]);

  return (
    <View>
      <TouchableOpacity style={styles.header} onPress={onHeaderPress}>
        <Text style={styles.headerText}>{date.toDateString()}</Text>
        <FontAwesome5
          name="calendar-day"
          size={32}
          color={colors.raisinBlack}
        />
      </TouchableOpacity>
      {open ? (
        <Calendar
          style={styles.calendar}
          date={formatDate(date)}
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{
            selectedDotColor: colors.blizardBlue,
            arrowColor: colors.blizardBlue,
          }}
          enableSwipeMonths
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 36,
    marginRight: 10,
    color: colors.raisinBlack,
  },
  calendar: {
    height: '100%',
  },
});

export default DateHeader;
