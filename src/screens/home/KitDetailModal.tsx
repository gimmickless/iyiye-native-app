import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, {
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  Alert,
  Image,
  NativeSegmentedControlIOSChangeEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View
} from 'react-native'
import { LocalizationContext } from 'contexts/Localization'
import { ThemeContext, Text, Button } from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { HomeStackParamList } from 'router/stacks/Home'
import InputSpinner from 'react-native-input-spinner'
import {
  defaultContainerViewHorizontalPadding,
  defaultHeaderButtonSize,
  defaultKitImageHeight,
  getHyperlinkTextColor,
  linkSuffixIcon,
  maxKitCountPerCart
} from 'utils/constants'
import * as Sharing from 'expo-sharing'
import SegmentedControl from '@react-native-community/segmented-control'
import Carousel from 'pinar'
import Constants from 'expo-constants'
import { useEffect } from 'react'

type KitDetailModalProps = RouteProp<HomeStackParamList, 'KitDetailModal'>

const KitDetailModal: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<KitDetailModalProps>()
  const { t } = useContext(LocalizationContext)
  const scheme = useColorScheme()
  const { theme: rneTheme } = useContext(ThemeContext)
  const window = useWindowDimensions()
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [selectedDetailTabIndex, setSelectedDetailTabIndex] = useState(0)
  const detailCarouselRef = useRef<Carousel>(null)
  const id = route.params.id

  const [imageEntries] = useState([
    {
      key: 0,
      url: 'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/burger.jpg'
    },
    {
      key: 1,
      url: 'https://iyiye-meta-files.s3-eu-west-1.amazonaws.com/images/category/chicken.jpg'
    }
  ])

  const kitDetailTabList = useMemo(
    () => [
      {
        value: 'ingredients',
        text: t('screen.home.kitDetailModal.segmentedControl.body.ingredients')
      },
      {
        value: 'preparation',
        text: t('screen.home.kitDetailModal.segmentedControl.body.preparation')
      }
    ],
    [t]
  )

  // TODO: Get details from AppSync call
  const isKitInUserCart = false
  const kit = {
    price: 12.99,
    author: {
      username: 'vahdet'
    }
  }

  // Customize header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {/* Share */}
          <Pressable
            style={styles.headerRightButton}
            disabled={true} // TODO: Enable When ready
            onPress={async () => {
              const isShareAvailable = await Sharing.isAvailableAsync()

              if (!isShareAvailable) {
                Alert.alert(
                  t('screen.home.kitDetailModal.alert.shareNotAvailable.title')
                )
                return
              }
              //TODO: Give a real URL
              await Sharing.shareAsync('urlToKit', {})
            }}
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={defaultHeaderButtonSize}
              color={rneTheme.colors?.primary}
            />
          </Pressable>
          {/* Like */}
          <Pressable
            style={styles.headerRightButton}
            onPress={() => setLiked((prev) => !prev)}
          >
            <MaterialCommunityIcons
              name={liked ? 'heart' : 'heart-outline'}
              size={defaultHeaderButtonSize}
              color={rneTheme.colors?.primary}
            />
          </Pressable>
        </View>
      )
    })
  }, [liked, navigation, rneTheme.colors?.primary, t])

  useEffect(() => {
    if (!detailCarouselRef.current) return
    const scrollIndex = selectedDetailTabIndex === 0 ? -1 : 1
    detailCarouselRef.current.scrollBy({ index: scrollIndex })
  }, [selectedDetailTabIndex])

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        showsControls={false}
        width={window.width}
        height={defaultKitImageHeight}
        style={styles.carousel}
      >
        {imageEntries.map((e) => (
          <Image
            key={e.key}
            source={{ uri: e.url }}
            style={styles.carouselImage}
          />
        ))}
      </Carousel>
      <View style={styles.kitTitleContainer}>
        <Text h4>Kit Name</Text>
        <Text
          style={{
            color: getHyperlinkTextColor(scheme === 'dark')
          }}
          onPress={() =>
            navigation.navigate(
              'AuthorProfileDefault' as keyof HomeStackParamList,
              { username: kit.author.username }
            )
          }
        >
          {kit.author.username}&nbsp;{linkSuffixIcon}
        </Text>
      </View>
      <View style={styles.detailContainer}>
        <SegmentedControl
          tintColor={rneTheme.colors?.primary}
          values={kitDetailTabList.map((x) => x.text)}
          selectedIndex={selectedDetailTabIndex}
          onChange={(
            event: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>
          ) => {
            setSelectedDetailTabIndex(event.nativeEvent.selectedSegmentIndex)
          }}
        />
        <Carousel
          ref={detailCarouselRef}
          showsControls={false}
          showsDots={false}
          scrollEnabled={false}
          width={window.width}
        >
          <ScrollView>
            <Text>
              Lorem ipsum dolor sit amet, pri ut suavitate scripserit, usu ex
              aliquid impedit evertitur, nam wisi harum ne. Eos cu meis
              dissentias, no qui harum inermis, erant definitionem sed ne. Eu
              porro possim periculis vis, habemus imperdiet qui ne. Ferri
              perfecto te has. Et illud iisque usu. Saepe possit iudicabit sit
              eu, cu dico iisque meliore vim. Quo sint legere ei, vis te sale
              illud nostrum, ei amet viderer sea. Habeo dicit legere ne has, mea
              prima minim epicuri in. Duo et quem populo assueverit. Justo
              ignota similique in has, cu adhuc denique vivendum qui, ea mel
              mollis moderatius definitiones. Everti fuisset intellegebat ea
              vim. Nec aliquip consequuntur ei, no nam utamur percipit
              intellegat. Ut quod dolore antiopam eum, veniam discere
              persequeris eos ex. Per augue luptatum ut. Laoreet noluisse ex
              vix. Nihil laoreet pri te. Doming omnium aliquip ne pro. Nec te
              vidisse reprimique, nam aliquam recteque ut. Everti verterem eos
              at, ut habeo diceret sea. Et augue fabellas ocurreret mea, ex mel
              choro aperiri principes. Pro amet nostro audiam ea, vel no hinc
              falli. Per at erroribus ullamcorper, mucius inermis eum no, at qui
              quem dolor invidunt. Recteque assentior ad qui, est cu putant
              gloriatur, etiam eligendi dissentiet ea duo. Nam populo facilisi
              cu. Quo repudiare adversarium eu, ut his verear delectus
              deseruisse. Qui adhuc illud cu, no has labitur legimus expetenda,
              usu ad regione omnesque quaerendum. Vivendo electram cu vim, reque
              mentitum omittantur ut cum. Commodo verterem mea te, his quem
              omnis meliore id, idque menandri ei cum. Cu vis vocibus offendit
              honestatis. Ex nostro labitur percipitur eos, ut persius
              adolescens est. Est everti vituperata incorrupte ea, an rebum
              clita his. Nec ut sumo verterem efficiantur, no quo labores
              oportere. Ei choro impedit delectus est, eos cu complectitur
              delicatissimi. Postea quaeque vis ut. In cum graecis petentium,
              nec in wisi exerci, sed percipit menandri adipisci at. Ei qui quis
              enim diceret, quo eu movet fabellas repudiare. Eum ea libris
              dictas posidonium, quas perpetua delicatissimi ad vis, ad vis
              adhuc fastidii. Cu quem vocent facilisi vel. Option antiopam ad
              pro, usu nostrud instructior at. Tota recteque mea cu, modus summo
              suscipiantur eu his. Mel assum audiam virtute in, porro sonet an
              eos. Has mundi partem civibus eu, ea qui detracto lucilius
              legendos, vix nihil numquam referrentur ea. Possim civibus
              qualisque ut his, ipsum partem sensibus mei ex. Sale tempor
              malorum vel ad, ludus mentitum est eu. Ne sea augue omnesque, amet
              omittantur cu sed. Ea quo sumo unum epicuri, at ius putant omnium.
              Etiam accusam menandri qui an, ea meis rationibus mel. Tollit
              percipit principes mel in. Cu eum salutandi consequuntur. Eu sit
              pertinax partiendo vulputate, suas munere ut nec. Enim simul
              aperiam pri no, ea legimus prodesset has, an dolorum
              necessitatibus quo. Cum solum possim debitis id, soleat copiosae
              torquatos an per. In mei impetus aeterno labitur, nec melius
              eloquentiam mediocritatem ne. Laoreet tacimates complectitur per
              at, cum at wisi solum nominavi. Has debet mollis an. Enim sonet
              moderatius ius te, ad vix aeterno euripidis, ius facilis
            </Text>
          </ScrollView>
          <ScrollView>
            <Text>
              Qui ne meliore omittantur. Per ea enim autem molestie, postea
              albucius sadipscing ne nam. Vel natum legere aliquip et. Vim quis
              eros probatus cu, solum vivendo ea mel. Ut ipsum commune
              omittantur vel. Vero oratio usu ad, has hinc quaestio deseruisse
              in. Ius in illum alienum, idque dissentiet per te, ei populo
              maluisset nec. Vix harum repudiare no, nec commune argumentum no.
              Vel sale congue ne, ne mel augue dictas bonorum. Nostro aperiri
              dolorem no vix, ferri veritus ponderum pro te, qui ea wisi
              dignissim. Ponderum erroribus cum ex, vel timeam erroribus
              intellegam ut. Quando putent pro ne, at ubique intellegam
              liberavisse sea. Tibique epicurei assueverit no est, fastidii
              eligendi id vix. Usu quaeque omittam ad. Qui primis interesset cu.
              Et eum dolore eirmod accusam, eam sale vidit disputando et,
              eripuit nostrum corrumpit in duo. Ad erat paulo accusam vix. No
              exerci expetendis usu, volumus theophrastus eam ex, clita civibus
              vim no. Quo virtute labores omittantur in, paulo omnes tollit vel
              in. Eu pri omnium volumus, id probatus contentiones disputationi
              vel. Affert iudico omittam at vis. Nam oporteat verterem te. Debet
              aeque vulputate cu eos. Prima convenire repudiandae te eam, nec
              hinc dolor cu. Erat constituam intellegebat eu eam. Nec ridens
              epicuri ea. Ex est vocibus nostrum. Cu dicam ancillae usu, cu vel
              graeci persequeris appellantur. Per liber saepe et, homero
              assueverit eos no. Cum an viris dolor, an usu graece minimum
              luptatum, vidit partiendo liberavisse eos ei. At ipsum honestatis
              usu. Eu mei dolorum definiebas, vidit impedit tincidunt in duo.
              Graeci tacimates ad cum, te nostrud tractatos dissentiunt sea,
              utinam sanctus ius te. Pri id autem voluptua, ut erat dictas nam.
              Et sea molestie intellegat voluptatibus. Cu nec eius mentitum,
              nullam atomorum est te, nec laudem mandamus dissentiunt in. Cu
              corpora praesent eam. Eam no sint tantas senserit. Et soluta
              aliquip legimus sea, per ei utinam platonem praesent, euismod
              euripidis constituam at eos. Velit dolor eirmod et est. An paulo
              laboramus assueverit mea. Pro ei euismod phaedrum, duo interesset
              complectitur voluptatibus ea. Sed sonet nobis tamquam ad, nulla
              legere qui id. Te facilis referrentur vis. Mea et mazim invenire
              conceptam, ex veniam constituto eum. No melius reprehendunt nam,
              cum sanctus suscipit ea. Eam ne scripta corrumpit. Hinc eros
              maiorum ea his. Stet habeo inimicus pro in.
            </Text>
          </ScrollView>
        </Carousel>
      </View>
      {/* Actions */}
      <View
        style={[
          styles.action,
          {
            backgroundColor: rneTheme.colors?.grey5,
            width: window.width,
            paddingHorizontal: defaultContainerViewHorizontalPadding
          }
        ]}
      >
        <View style={styles.priceContainer}>
          <Text h4>€ {count ? kit.price * count : kit.price}</Text>
          {count > 1 ? (
            <Text>
              {count}&nbsp;*&nbsp;{kit.price}
            </Text>
          ) : undefined}
        </View>

        {isKitInUserCart ? (
          <React.Fragment>
            <InputSpinner
              skin="modern"
              max={maxKitCountPerCart}
              min={1}
              color={rneTheme.colors?.primary}
              colorMax={rneTheme.colors?.error}
              value={count}
              onChange={(num: number) => {
                setCount(num)
              }}
            />
            <Button
              type="outline"
              title={t('screen.home.kitDetailModal.button.removeFromCart')}
              buttonStyle={[
                styles.removeButton,
                { borderColor: rneTheme.colors?.error }
              ]}
              titleStyle={{ color: rneTheme.colors?.error }}
              icon={
                <MaterialCommunityIcons
                  name="cart-off"
                  size={15}
                  color={rneTheme.colors?.error}
                />
              }
            />
          </React.Fragment>
        ) : (
          <Button
            type="solid"
            title={t('screen.home.kitDetailModal.button.addToCart')}
            buttonStyle={styles.addButton}
            icon={
              <MaterialCommunityIcons name="cart" size={15} color="white" />
            }
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  headerRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerRightButton: {
    paddingHorizontal: defaultContainerViewHorizontalPadding
  },
  carousel: {
    flex: 3
  },
  carouselImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: defaultKitImageHeight
  },
  kitTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: defaultContainerViewHorizontalPadding
  },
  detailContainer: {
    flex: 4
  },
  action: {
    flex: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  priceContainer: {
    flexDirection: 'column'
  },
  addButton: {
    borderRadius: 12
  },
  removeButton: {
    borderRadius: 12
  }
})

export default KitDetailModal
