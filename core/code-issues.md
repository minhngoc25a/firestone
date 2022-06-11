# Intro

This section mentions the big code issues I'm facing and for which I don't have any solution for. If you have any idea,
feel free to experiment and let me know :)

# `cannot read property "destroyed" of null`

This happens sometimes when you call `detectChanges()` after modifying a collection that already had elements in it. I
haven't found a way around it other than first assigning the collection to an empty array, triggering the change
detection, then assigning the value + change detection in a timeout.
This leads to a clunky user experience (where the whole component refreshes), but I haven't found anything better.

For a simple example, see `bgs-simulator-minion-selection.component.ts`, in `ngAfterContentInit()`.

Update (2022/02/10): it looks like that adding a trackBy function improves the situation. I have not been able to test
this extensively yet, but it looks like it helps at least in some cases.
Update (2022/02/10): looks like that's not the case (I tried that in the `bgs-simulator-minion-selection` component, and
still got the exception)
Update (2022/03/25): this can also happen when calling detechChanges() on a component that has been destroyed. See
card-tooltip.directive. Using "markForCheck" doesn't seem to cause the issue though (but it doesn't really work as well)

# Having to call `detectChanges()` in the first place

If you look at how Observables from the store are handled, including `AbstractSubscriptionComponent::mapData()`, you'll
see that `detectChanges()` is called all the time.
My understanding of async pipes is that this shouldn't be needed. However, if you remove it, the template doesn't update
when the observable updates.
Understanding and getting rid of that issue could possibly also fix the `cannot read property "destroyed" of null` issue
above.
