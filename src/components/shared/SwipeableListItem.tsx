import React, { RefObject, useContext, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Text, ThemeContext } from 'react-native-elements'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { LocalizationContext } from 'contexts/Localization'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface SwipeableListItemProps {
  editAction?: () => void
  deleteAction?: () => void
  hintOnShowUp?: boolean
}

const hintShowDelay = 250
const hintShowDurationMillis = 1750

const actionButtonIconSize = 24

const SwipeableListItem: React.FC<SwipeableListItemProps> = (props) => {
  const { t } = useContext(LocalizationContext)
  const { theme: rneTheme } = useContext(ThemeContext)
  const swipeable = useRef(null) as RefObject<Swipeable>

  useEffect(() => {
    if (!props.hintOnShowUp) return

    setTimeout(() => {
      swipeable.current?.openRight()
    }, hintShowDelay)
    setTimeout(() => {
      swipeable.current?.close()
    }, hintShowDurationMillis)
  }, [props.hintOnShowUp])

  const ListItemRightActions = (
    progress: Animated.AnimatedInterpolation,
    _dragAnimatedValue: Animated.AnimatedInterpolation
  ) => {
    const transEdit = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [160, 0]
    })
    const transDelete = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0]
    })
    return (
      <View style={styles.listItemRightActionsContainer}>
        <Animated.View
          style={{
            ...styles.listItemAction,
            transform: [{ translateX: transEdit }]
          }}
        >
          <RectButton
            style={{
              ...styles.listItemEditAction,
              backgroundColor: rneTheme.colors?.success
            }}
            onPress={props.editAction}
          >
            <MaterialCommunityIcons
              name="pencil"
              size={actionButtonIconSize}
              color="white"
            />
            <Text style={styles.listItemActionText}>
              {t('common.button.edit').toUpperCase()}
            </Text>
          </RectButton>
        </Animated.View>
        <Animated.View
          style={{
            ...styles.listItemAction,
            transform: [{ translateX: transDelete }]
          }}
        >
          <RectButton
            style={{
              ...styles.listItemDeleteAction,
              backgroundColor: rneTheme.colors?.error
            }}
            onPress={props.deleteAction}
          >
            <MaterialCommunityIcons
              name="trash-can"
              size={actionButtonIconSize}
              color="white"
            />
            <Text style={styles.listItemActionText}>
              {t('common.button.delete').toUpperCase()}
            </Text>
          </RectButton>
        </Animated.View>
      </View>
    )
  }

  return (
    <Swipeable
      ref={swipeable}
      friction={1.5}
      rightThreshold={40}
      renderRightActions={
        (props.editAction || props.deleteAction) && ListItemRightActions
      }
    >
      {props.children}
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  listItemRightActionsContainer: {
    width: 160,
    flexDirection: 'row'
  },
  listItemAction: {
    flex: 1
  },
  listItemEditAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemDeleteAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemActionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent'
  }
})

export default SwipeableListItem
