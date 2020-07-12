import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
const CssTextField = withStyles({
  root: {
    // marginLeft: '20px',
    // marginRight: theme.spacing(1),
    width: '100%'
  }
})(TextField);

export default CssTextField;
