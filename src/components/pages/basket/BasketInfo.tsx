import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React from 'react'
import { BasketInfoModel, ChartData } from '../../../types/baskets';
import ProgressBar from '../../PorgressBar';
import { BalanceChart, BasketChart, EquityChart } from '../charts';
import { TimeFilterType } from '../../../types/baskets';
import * as services from '../../../service';
import { useEffect } from 'react';
import {ArrowDropUp} from '@material-ui/icons';

interface Props {
  label: string;
  value: string | React.ReactElement | number | undefined;
  color?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',

    },
    column: {
      boxSizing: 'border-box',
      [theme.breakpoints.down('lg')]: {
        fontSize: '15px',
        padding: '16px'
      },
      [theme.breakpoints.down('md')]: {
        fontSize: '15px',
        padding: '12px'
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '15px',
        padding: '12px'
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: '14px',
        padding: 0
      },
      [theme.breakpoints.up('xl')]: {
        padding: '24px'
      }
    },
    row: {
      lineHeight: '28px'
    },
    marginBar:{
      display:'inline', 
      backgroundImage: 'linear-gradient(to right,#ff1900,#ff9100, #00ff23,#039e18)', 
      width:'auto', 
      height:'24px',
      borderRadius:'8px',
      flexGrow: 1,
      marginLeft:'2px',
      marginRight:'2px',
      margin:'2px'
    }
  }),
);

const Row = ({ label, value, color }: Props) => {
  const classes = useStyles();
  return (
    <Grid container alignItems='center' className={classes.row}>
      <Grid md={4} xs={6}><b>{label}</b></Grid>
      <Grid md={8} xs={6}>
        {color && <span style={{ color: color }}>{value}</span>}
        {!color && value}
      </Grid>
    </Grid>
  )
}

const Gage = ({value})=>{
  const classes = useStyles();
  let position=-2;

  if (value == 0){
    position = 94;
  }else if (value < 100){
    position = -2;
  }else if (value < 400){
    position = (value - 100)  * 32 / 300;
  }else if (value < 700){
    position = ((value - 400) * 32 / 300) + 32;
  }else if (value < 1000){
    position = ((value - 700) * 32 / 300) + 64;
  }else{
    position = 94;
  }

  return <Grid container>
    <label>{value}</label> 
    <Grid container className={classes.marginBar}>
      <ArrowDropUp style={{position:'relative',left:`${position}%`}} />
    </Grid>
  </Grid>
}


const ChartRow: React.FC = ({ children }) => {
  const classes = useStyles();
  return <Grid container justify='space-between' className={classes.row}>{children}</Grid>
}

const Column: React.FC = ({ children }) => {
  const classes = useStyles();
  return <Grid className={classes.column} md={6} xs={12}>{children}</Grid>
}

interface BasketInfoProps {
  data?: {
    main: BasketInfoModel;
    extra?: BasketInfoModel[];
  }
  displayGraphs?: boolean;
  basketId: string;
  chartSettings?: {
    from: Date;
    to: Date;
    type: TimeFilterType;
  }
}

const INIT_STATE = {
  main: {
    'Balance': {
      value: 1974.19
    },
    'Equity': {
      value: 1619.30
    },
    'Margin': {
      value: 178.75
    },
    'Free_Margin': {
      value: 1440.55
    },
    'Margin_Level': {
      value: 905.90
    },
    'Total_Orders': {
      value: 18
    },
    'Total_Sell': {
      value: 0
    },
    'Total_Buy': {
      value: 0
    },
    'Sell_Buy_Diff': {
      value: 0.00,
    },
    'Total_Sell_Profit': {
      value: 0.00,
      color: '#e8173d'
    },
    'Total_Buy_Profit': {
      value: 0.00,
      color: '#e8173d'
    },
    'Total_Profit': {
      value: 0.00,
      color: '#e8173d'
    }
  }
}



export default function BasketInfo({ 
  data = INIT_STATE, 
  displayGraphs = false, 
  basketId,
  chartSettings
}: BasketInfoProps) {
  const { main, extra } = data || {};
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(
    () => {
      if (displayGraphs) {
        (async () => {
          setLoading(true);
          const data = await services.getBasketStatistics(
            basketId,
            {
              type: chartSettings?.type,
              from: chartSettings?.from,
              to: chartSettings?.to
            }
          );
          setChartData(data.map(x => ({ ...x, date: new Date(x.date) })));
          setLoading(false);
        })();
      }

    },
    [displayGraphs, chartSettings?.type, chartSettings?.from, chartSettings?.to]
  )

  return (
    <div className={classes.root}>
      <Grid container>
        <Column>
          <Row label='Balance' value={main?.['Balance']?.value} color='#506dbe' />
          <Row label='Equity' value={<ProgressBar leftColor='#506dbe' rightColor='#b43232' left={+main?.['Equity']?.value} right={+main?.['Balance']?.value - +main?.['Equity']?.value} hideRight />} />
          <Row label='Margin' value={<ProgressBar rightColor='#b43232' leftColor='#506dbe' right={+main?.['Margin']?.value} left={+main?.['Free_Margin']?.value} />} />
          <Row label='Margin_Level' value={<Gage value={main?.['Margin_Level']?.value} />} />
          <Row label='Total_Market_Orders' value={main?.['Total_Market_Orders']?.value} />
        </Column>
        <Column>
          <Row label='Total_Sell_Lots' value={main?.['Total_Sell_Lots']?.value} />
          <Row label='Total_Buy_Lots' value={main?.['Total_Buy_Lots']?.value} />
          <Row label='Sell_Buy_Diff_Lots' value={main?.['Sell_Buy_Diff_Lots']?.value} />
          <Row label='Total_Sell_Profit' value={main?.['Total_Sell_Profit']?.value} color={main?.['Total_Sell_Profit']?.color} />
          <Row label='Total_Buy_Profit' value={main?.['Total_Buy_Profit']?.value} color={main?.['Total_Buy_Profit']?.color} />
          <Row label='Total_Profit' value={main?.['Total_Profit']?.value} color={main?.['Total_Profit']?.color} />
        </Column>
      </Grid>
      {!loading && displayGraphs && <ChartRow>
        <BalanceChart data={chartData} />
        <EquityChart data={chartData} />
      </ChartRow>}
      {expanded && <Grid container>
        {extra.map(extraData => {
          return <Column>{Object.keys(extraData).map(key => <Row label={key} value={extraData[key]?.value} color={extraData[key]?.color} />)}</Column>
        })}
      </Grid>}
      {extra && <Grid container justify='center'>
        <Grid><Button variant='outlined' onClick={() => setExpanded(p => !p)}>{`Load ${expanded ? 'less' : 'more'} ...`}</Button></Grid>
      </Grid>}
    </div>
  )
}
