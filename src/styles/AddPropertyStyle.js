import {StyleSheet} from 'react-native';

const PRIMARY='#0A84FF';
const SUCCESS='#16A34A';
const DANGER='#EF4444';
const BG='#F5F7FA';
const WHITE='#FFFFFF';
const BORDER='#E5E7EB';
const TEXT='#1F2937';
const SUB='#6B7280';

const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:BG,
},

scroll:{
padding:15,
paddingBottom:120,
},

card:{
backgroundColor:WHITE,
borderRadius:15,
padding:15,
marginBottom:15,
shadowColor:'#000',
shadowOpacity:0.08,
shadowRadius:8,
shadowOffset:{
width:0,
height:3,
},
elevation:4,
},

title:{
fontSize:13,
fontWeight:'700',
color:TEXT,
marginBottom:15,
},

subTitle:{
fontSize:14,
color:SUB,
marginBottom:15,
lineHeight:22,
},

input:{
height:35,
backgroundColor:'#fff',
borderWidth:1,
borderColor:BORDER,
borderRadius:10,
paddingHorizontal:15,
fontSize:13,
color:TEXT,
},

textarea:{
height:120,
textAlignVertical:'top',
paddingTop:15,
},

row:{
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',
},

rowWrap:{
flexDirection:'row',
flexWrap:'wrap',
},

buttonRow:{
flexDirection:'row',
justifyContent:'space-between',
marginTop:20,
marginBottom:30,
},

nextButton:{
backgroundColor:PRIMARY,
height:52,
borderRadius:10,
alignItems:'center',
justifyContent:'center',
paddingHorizontal:35,
},

nextText:{
fontSize:16,
fontWeight:'700',
color:'#fff',
},

previousButton:{
backgroundColor:'#9CA3AF',
height:52,
borderRadius:10,
alignItems:'center',
justifyContent:'center',
paddingHorizontal:30,
},

previousText:{
fontSize:16,
fontWeight:'700',
color:'#fff',
},

submitButton:{
backgroundColor:SUCCESS,
height:52,
borderRadius:10,
alignItems:'center',
justifyContent:'center',
paddingHorizontal:35,
},

submitText:{
fontSize:16,
fontWeight:'700',
color:'#fff',
},

cancelButton:{
backgroundColor:DANGER,
height:50,
borderRadius:10,
alignItems:'center',
justifyContent:'center',
paddingHorizontal:30,
},

cancelText:{
fontSize:15,
fontWeight:'700',
color:'#fff',
},
/* ===========================
   Chips
=========================== */

chip:{
    paddingHorizontal:18,
    paddingVertical:10,
    borderRadius:25,
    backgroundColor:'#F3F4F6',
    borderWidth:1,
    borderColor:'#E5E7EB',
    marginRight:10,
    marginBottom:10,
},

selectedChip:{
    backgroundColor:PRIMARY,
    borderColor:PRIMARY,
},

chipText:{
    fontSize:11,
    color:TEXT,
    fontWeight:'600',
},

selectedChipText:{
    color:'#FFFFFF',
    fontWeight:'700',
},

/* ===========================
   Image Picker
=========================== */

imagePickerButton:{
    height:55,
    borderWidth:2,
    borderStyle:'dashed',
    borderColor:PRIMARY,
    borderRadius:12,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#EEF6FF',
},

imagePickerText:{
    fontSize:16,
    color:PRIMARY,
    fontWeight:'700',
},

/* ===========================
   Image Grid
=========================== */

imageBox:{
    width:'31%',
    margin:'1%',
    borderRadius:12,
    overflow:'hidden',
    backgroundColor:'#FFFFFF',
    elevation:3,
},

previewImage:{
    width:'100%',
    height:110,
    resizeMode:'cover',
},

/* ===========================
   Cover Badge
=========================== */

coverBadge:{
    position:'absolute',
    top:6,
    left:6,
    backgroundColor:SUCCESS,
    paddingHorizontal:8,
    paddingVertical:3,
    borderRadius:8,
},

coverBadgeText:{
    color:'#FFFFFF',
    fontSize:11,
    fontWeight:'700',
},

/* ===========================
   Remove Image
=========================== */

removeImage:{
    position:'absolute',
    top:6,
    right:6,
    width:24,
    height:24,
    borderRadius:12,
    backgroundColor:DANGER,
    alignItems:'center',
    justifyContent:'center',
},

removeImageText:{
    color:'#FFFFFF',
    fontSize:14,
    fontWeight:'bold',
},

/* ===========================
   Cover Button
=========================== */

coverButton:{
    backgroundColor:PRIMARY,
    paddingVertical:8,
    alignItems:'center',
},

coverButtonText:{
    color:'#FFFFFF',
    fontSize:12,
    fontWeight:'700',
},

/* ===========================
   Location Button
=========================== */

locationButton:{
    backgroundColor:'#E8F2FF',
    borderWidth:1,
    borderColor:PRIMARY,
    borderRadius:10,
    height:50,
    alignItems:'center',
    justifyContent:'center',
},

locationButtonText:{
    color:PRIMARY,
    fontWeight:'700',
    fontSize:15,
},

/* ===========================
   PDF Card
=========================== */

pdfCard:{
    marginTop:15,
    padding:15,
    borderRadius:10,
    backgroundColor:'#F8FAFC',
    borderWidth:1,
    borderColor:BORDER,
},

pdfText:{
    fontSize:15,
    color:TEXT,
    fontWeight:'600',
},
/* ===========================
   Summary
=========================== */

summaryHeading:{
    fontSize:20,
    fontWeight:'700',
    color:TEXT,
    marginBottom:20,
},

summaryRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingVertical:12,
    borderBottomWidth:1,
    borderBottomColor:'#F1F5F9',
},

summaryLabel:{
    flex:1,
    fontSize:15,
    fontWeight:'600',
    color:SUB,
},

summaryValue:{
    flex:1,
    textAlign:'right',
    fontSize:15,
    fontWeight:'700',
    color:TEXT,
},

/* ===========================
   Progress
=========================== */

progressContainer:{
    height:10,
    backgroundColor:'#E5E7EB',
    borderRadius:20,
    overflow:'hidden',
    marginBottom:20,
},

progressBar:{
    height:'100%',
    backgroundColor:PRIMARY,
    borderRadius:20,
},

/* ===========================
   Loader
=========================== */

loaderOverlay:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:'rgba(0,0,0,0.35)',
    alignItems:'center',
    justifyContent:'center',
    zIndex:999,
},

loaderBox:{
    backgroundColor:'#FFFFFF',
    padding:25,
    borderRadius:15,
    alignItems:'center',
    elevation:6,
},

loaderText:{
    marginTop:15,
    fontSize:16,
    fontWeight:'600',
    color:TEXT,
},

/* ===========================
   Empty View
=========================== */

emptyContainer:{
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:50,
},

emptyText:{
    marginTop:12,
    color:SUB,
    fontSize:15,
},

/* ===========================
   Divider
=========================== */

divider:{
    height:1,
    backgroundColor:'#E5E7EB',
    marginVertical:15,
},

badge:{
    backgroundColor:PRIMARY,
    paddingHorizontal:10,
    paddingVertical:4,
    borderRadius:20,
    alignSelf:'flex-start',
},

badgeText:{
    color:'#FFFFFF',
    fontSize:12,
    fontWeight:'700',
},

/* ===========================
   Footer Space
=========================== */

bottomSpace:{
    height:80,
},

chipContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 8,
},

chip: {
  borderWidth: 1,
  borderColor: '#D1D5DB',
  borderRadius: 20,
  paddingHorizontal: 14,
  paddingVertical: 9,
  backgroundColor: '#fff',
},

chipSelected: {
  backgroundColor: '#012353',
  borderColor: '#012353',
},

chipText: {
  color: '#555',
  fontSize: 11,
  fontWeight: '600',
},

chipTextSelected: {
  color: '#fff',
},

});

export default styles;