import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import React from 'react';
import { toggleUIOption } from 'store/uiSlice';

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  details: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },
}));

const Validation = () => {
  const dispatch = useAppDispatch();
  const validationExpanded = useAppSelector((state) => state.ui.validationExpanded);
  const classes = useStyles();
  const units = Object.values(useAppSelector((state) => state.roster.units));

  const warnings = [];
  for (const unit of units) {
    const isPsycher = !unit.xenosRules.some((x) =>
      ['Psychic 1', 'Psychic 2', 'Psychic 3', 'Psychic 4'].includes(x)
    );
    if (unit.points > 12)
      warnings.push([unit.name, 'No Unit may cost more than 12 points!']);
    if (unit.name !== 'Unit' && unit.points < 1)
      warnings.push([unit.name, 'No Unit may cost less than one point!']);
    if (unit.xenosRules.includes('Fanatical Discipline') && unit.stats.courage < 3)
      warnings.push([unit.name, 'This unit can´t have less than 3 courage!']);
    if (unit.xenosRules.includes('Hive Mind') && unit.xenosRules.includes('Commander'))
      warnings.push([unit.name, 'A Commander can´t have Hive Mind!']);
    if (unit.xenosRules.includes('Slow') && unit.options.includes('Mobile'))
      warnings.push([unit.name, 'Slow and Mobile can´t be used together!']);
    if (unit.xenosRules.includes('Psychic Hazards') && !isPsycher)
      warnings.push([unit.name, 'Only a psychic unit can take Psychic Hazards!']);
    if (
      (unit.xenosRules.includes('Psychic Species 1') ||
        unit.xenosRules.includes('Psychic Species 2') ||
        unit.xenosRules.includes('Psychic Species 3')) &&
      !isPsycher
    )
      warnings.push([unit.name, 'Only a psychic unit can take Psychic Species!']);
    if (
      unit.xenosRules.includes('Psychic 1') &&
      unit.psiPowers &&
      unit.psiPowers.length > 1
    )
      warnings.push([unit.name, 'A Psychic 1 unit can only take 1 Psychic Power!']);
    if (
      unit.xenosRules.includes('Psychic 2') &&
      unit.psiPowers &&
      unit.psiPowers.length > 2
    )
      warnings.push([unit.name, 'A Psychic 2 unit can only take 2 Psychic Powers!']);
    if (
      unit.xenosRules.includes('Psychic 3') &&
      unit.psiPowers &&
      unit.psiPowers.length > 3
    )
      warnings.push([unit.name, 'A Psychic 3 unit can only take 3 Psychic Powers!']);
    if (
      unit.xenosRules.includes('Psychic 4') &&
      unit.psiPowers &&
      unit.psiPowers.length > 3
    )
      warnings.push([unit.name, 'A Psychic 4 unit can only take 3 Psychic Powers!']);
  }

  return (
    <>
      {warnings.length !== 0 && (
        <Accordion
          expanded={validationExpanded}
          onChange={() => dispatch(toggleUIOption('validationExpanded'))}
          style={{ maxWidth: 1210 }}
        >
          <AccordionSummary
            className={classes.title}
            expandIcon={<ExpandMoreIcon className={classes.title} />}
          >
            <Typography variant="h5">Warnings</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <List>
              {warnings.map(([name, text], index) => (
                <ListItem key={index}>
                  <ListItemIcon className={classes.details}>
                    <ErrorIcon />
                  </ListItemIcon>
                  <ListItemText primary={name} secondary={text} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

export default Validation;
