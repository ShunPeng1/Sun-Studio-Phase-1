import IState from "./IState";
import IStateMomentoStrategy from "./IStateMomentoStrategy";
import IStatePredicate from "./IStatePredicate";
import IStateTransition from "./IStateTransition";
import IStateTransitionData from "./IStateTransitionData";



class BaseStateMachine {
    private currentState: StateNode;
    private nodes: Map<any, StateNode> = new Map();
    private anyStateTransitions: Set<IStateTransition> = new Set();

    private lastTransitionData: IStateTransitionData | null = null;

    protected stateHistoryStrategy: IStateMomentoStrategy;

    protected constructor(initialStateNode: StateNode, onEnterCall: boolean = false, enterData: IStateTransitionData | null = null) {
        this.nodes.set(initialStateNode.State.constructor, initialStateNode);
        this.currentState = initialStateNode;

        if (onEnterCall) {
            initialStateNode.State.enterState(enterData);
        }
    }

    

    public static Builder = class {
        private initialStateNode: StateNode;
        private onEnterCall: boolean;
        private enterData: IStateTransitionData | null = null;
        private stateHistoryStrategy: IStateMomentoStrategy;

        public Build(): BaseStateMachine {
            const stateMachine = new BaseStateMachine(this.initialStateNode, this.onEnterCall, this.enterData);
            stateMachine.stateHistoryStrategy = this.stateHistoryStrategy;
            return stateMachine;
        }

        public WithInitialState(initialState: IState, onEnterCall: boolean, enterData: IStateTransitionData | null = null): this {
            this.initialStateNode = new StateNode(initialState);
            this.onEnterCall = onEnterCall;
            this.enterData = enterData;
            return this;
        }

        public WithHistoryStrategy(historyStrategy: IStateMomentoStrategy): this {
            this.stateHistoryStrategy = historyStrategy;
            return this;
        }
    }

    private GetTransition(): IStateTransition | null {
        for (const transition of this.anyStateTransitions) {
            if (transition.condition.evaluate()) {
                return transition;
            }
        }

        for (const transition of this.currentState?.Transitions) {
            if (transition.condition.evaluate()) {
                return transition;
            }
        }

        return null;
    }

    public AddOrOverwriteState(baseState: IState, transitions: Set<IStateTransition>): void {
        this.nodes.set(baseState.constructor, new StateNode(baseState, transitions));
    }

    public RemoveState(state: IState): void {
        this.nodes.delete(state.constructor);
    }

    public AddTransition(fromState: IState, toState: IState, predicate: IStatePredicate): void {
        this.GetOrAddNode(fromState).AddTransition(toState, predicate);
    }

    public AddAnyTransition(toState: IState, predicate: IStatePredicate): void {
        this.anyStateTransitions.add({ toState: toState, condition: predicate });
    }

    public RemoveTransition(fromState: IState, toState: IState, predicate: IStatePredicate): void {
        this.GetOrAddNode(fromState).RemoveTransition(toState, predicate);
    }

    public RemoveAnyTransition(toState: IState, predicate: IStatePredicate): void {
        this.anyStateTransitions.forEach(transition => {
            if (transition.toState === toState && transition.condition === predicate) {
                this.anyStateTransitions.delete(transition);
            }
        });
    }

    private GetOrAddNode(state: IState): StateNode {
        let node = this.nodes.get(state.constructor);
        if (!node) {
            node = new StateNode(state);
            this.nodes.set(state.constructor, node);
        }
        return node;
    }

    public SettoState(toState: IState | null, transitionData: IStateTransitionData | null = null): void {
        if (!toState || toState === this.currentState.State) return;

        const nextState = this.nodes.get(toState.constructor);
        if (nextState) {
            this.stateHistoryStrategy?.save(nextState.State, transitionData);
            this.SwitchState(nextState, transitionData);
        } else {
            console.warn(`State ${toState.constructor.name} not found in state machine.`);
        }
    }

    public GetcurrentState(): IState {
        return this.currentState?.State;
    }

    public GetcurrentStateType(): any {
        return this.currentState?.State.constructor;
    }

    public RestoreState(): void {
        if (!this.stateHistoryStrategy) return;
        const [enterState, exitOldStateParameters] = this.stateHistoryStrategy.restore();
        if (enterState) {
            this.SettoState(enterState, exitOldStateParameters);
        } else {
            console.warn("No state to restore.");
            this.SettoState(null);
        }
    }

    public PeakHistory(): [IState | null, IStateTransitionData | null] {
        if (!this.stateHistoryStrategy) return [null, null];
        const [enterState, exitOldStateParameters] = this.stateHistoryStrategy.restore(false);
        return [enterState, exitOldStateParameters];
    }

    private SwitchState(nextState: StateNode, transitionData: IStateTransitionData | null = null): void {
        this.currentState.State.exitState(transitionData);
        const lastStateEnum = this.currentState;
        this.currentState = nextState;
        nextState.State.enterState(transitionData);
    }
}


class StateNode {
    public State: IState;
    public Transitions: Set<IStateTransition>;

    constructor(state: IState, transitions: Set<IStateTransition> = new Set()) {
        this.State = state;
        this.Transitions = transitions;
    }

    public AddTransition(to: IState, condition: IStatePredicate): void {
        this.Transitions.add({ toState: to, condition: condition });
    }

    public RemoveTransition(to: IState, condition: IStatePredicate): void {
        this.Transitions.forEach(transition => {
            if (transition.toState === to && transition.condition === condition) {
                this.Transitions.delete(transition);
            }
        });
    }
}